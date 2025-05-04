package com.wo.karaoke.exception;

public class WrongUrlException extends RuntimeException {
  private static final String MESSAGE = "Wrong youtube URL";

  public WrongUrlException() {
    super(MESSAGE);
  }
}
