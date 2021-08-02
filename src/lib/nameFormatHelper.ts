declare module NameFormatHelper {
  interface NameFormatHelperInterface {
    startsWithUpperCase(): Boolean;
    isUpperCase(): Boolean;
    isComposed(): Boolean;
  }
}

class NameFormatHelper {
  startsWithUpperCase(): Boolean {
    return false;
  }

  isUpperCase(): Boolean {
    return false;
  }

  isComposed(): Boolean {
    return false;
  }
}
