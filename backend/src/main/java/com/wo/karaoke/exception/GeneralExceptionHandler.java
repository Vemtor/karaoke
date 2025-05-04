package com.wo.karaoke.exception;

import java.io.FileNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GeneralExceptionHandler {

  @ExceptionHandler(FileNotFoundException.class)
  public ResponseEntity<String> handleResourceNotFound(FileNotFoundException ex) {
    return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(WrongUrlException.class)
  public ResponseEntity<String> handleWrongUrl(WrongUrlException ex) {
    return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(AudioSplitException.class)
  public ResponseEntity<String> handleAudioSplitException(AudioSplitException ex) {
    return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
