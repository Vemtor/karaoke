# Base python dependencies
FROM eclipse-temurin:21-jre-jammy AS base-py-deps
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    python3-venv \
    ffmpeg \
    unzip \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists*
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p scripts && \
    wget https://github.com/tsurumeso/vocal-remover/releases/download/v5.1.1/vocal-remover-v5.1.1.zip -O vocal-remover.zip && \
    unzip vocal-remover.zip -d scripts/ && \
    rm vocal-remover.zip


# 1st stage for downloading Maven dependencies. It makes build faster by caching deps.
FROM eclipse-temurin:21-jdk-jammy AS deps

WORKDIR /build

# Copy the mvnw wrapper with executable permissions.
COPY --chmod=0755 mvnw mvnw
COPY .mvn/ .mvn/

RUN --mount=type=bind,source=pom.xml,target=pom.xml \
    --mount=type=cache,target=/root/.m2 ./mvnw dependency:go-offline -DskipTests


################################################################################
# 2nd stage for building the application. It produces a runnable JAR file.
FROM deps AS package

WORKDIR /build

COPY ./src src/
RUN --mount=type=bind,source=pom.xml,target=pom.xml \
    --mount=type=cache,target=/root/.m2 \
    ./mvnw package -DskipTests && \
    mv target/$(./mvnw help:evaluate -Dexpression=project.artifactId -q -DforceStdout)-$(./mvnw help:evaluate -Dexpression=project.version -q -DforceStdout).jar target/app.jar

################################################################################

# 3rd stage for extracting the application into separate layers.
FROM package AS extract

WORKDIR /build

RUN java -Djarmode=layertools -jar target/app.jar extract --destination target/extracted

################################################################################


# Final stage for running the application that contains the minimal
# runtime dependencies for the application.
# It uses a slimmer JRE image instead of full JDK used in previous stages.
FROM base-py-deps AS final

WORKDIR /backend

# Create Python virtual environment
RUN python3.10 -m venv /backend/.venv
ENV PATH="/backend/.venv/bin:$PATH"

RUN mkdir -p /backend/models \
    /backend/src/main/resources/transcriptions

# Set env for whisper model cache
ENV XDG_CACHE_HOME="/backend/models"

COPY ./scripts /backend/scripts

# Copy the executable from the "package" stage.
COPY --from=extract build/target/extracted/dependencies/ ./
COPY --from=extract build/target/extracted/spring-boot-loader/ ./
COPY --from=extract build/target/extracted/snapshot-dependencies/ ./
COPY --from=extract build/target/extracted/application/ ./

EXPOSE 8080

ENTRYPOINT [ "java", "org.springframework.boot.loader.launch.JarLauncher" ]
