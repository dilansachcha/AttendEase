package model;

/**
 *
 * @author USER
 */
public class Validations {

    public static boolean isEmailValid(String email) {
        return email.matches("^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$");
    }

    public static boolean isPasswordValid(String password) {
        return password.matches("^[0-9ABCD]{4,6}$");
    }

    public static boolean isAdminPasswordValid(String password) {
        return password.matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\\\S+$).{8,}$");
    }

    public static boolean isMobileNumberValid(String mobile) {
        return mobile.matches("^07[01245678]{1}[0-9]{7}$");

    }

}
