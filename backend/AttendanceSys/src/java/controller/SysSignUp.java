/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Employee;
import entity.Attendance_Status;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validations;
import model.Mail;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author USER
 */
@MultipartConfig //aniw dnnone - nttn request.getParameter eke output - null nm dla na MpC
@WebServlet(name = "SysSignUp", urlPatterns = {"/SysSignUp"})
public class SysSignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson(); //create gson lib
        //JsonObject responseJson = new JsonObject(); //create java obj

        JsonObject responseJson = new JsonObject(); //create java obj 4
        responseJson.addProperty("success", false);

        //client side eken elyt dla server side ekt hmben JSOn txt ek JsonObject kyn java obj ekt map krgnnw
        //JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);//request eke ena   - MultipartConfig unma Json ba 
        //System.out.println(requestJson.get("message").getAsString());//ewn msg ek print kra 2
        String mobile = request.getParameter("mobile");
        String email = request.getParameter("email");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String department = request.getParameter("department");
        String jobrole = request.getParameter("jobrole");
        String password = request.getParameter("password");
        //Part avatarImage = request.getPart("avatarImage");//Part obj ekk wdyt image ek

        if (mobile.isEmpty()) { //isBlank - whitespace denneth na - hbai old server jdk nisa use krn ba
            //mobile number is empty
            responseJson.addProperty("message", "Please fill in your Mobile Number");
        } else if (!Validations.isMobileNumberValid(mobile)) {
            //invalid mobile number
            responseJson.addProperty("message", "Invalid Mobile Number");
        } else if (email.isEmpty()) {
            //mobile number is empty
            responseJson.addProperty("message", "Please add an Email");
        } else if (!Validations.isEmailValid(email)) {
            //invalid mobile number
            responseJson.addProperty("message", "Invalid Email Address");
        } else if (firstName.isEmpty()) {
            //firstName is empty
            responseJson.addProperty("message", "Please fill in your First Name");
        } else if (lastName.isEmpty()) {
            //lastName is empty
            responseJson.addProperty("message", "Please fill in your Last Name");
        } else if (department.isEmpty()) {
            //lastName is empty
            responseJson.addProperty("message", "Please fill in your Department");
        } else if (jobrole.isEmpty()) {
            //lastName is empty
            responseJson.addProperty("message", "Please fill in your Job Role");
        } else if (password.isEmpty()) {
            //password is empty
            responseJson.addProperty("message", "Please pick a passkey to access the system");
        } else if (!Validations.isPasswordValid(password)) {
            //invalid password
            responseJson.addProperty("message", "Invalid Passkey!");
        } else {//db ekt dna wade

            Session session = HibernateUtil.getSessionFactory().openSession();

            //search mobile
            Criteria criteria1 = session.createCriteria(Employee.class);
            criteria1.add(Restrictions.eq("mobile", mobile));//menna me mobile no ekt adla users la hoynna

            if (!criteria1.list().isEmpty()) {

                //mobile number found
                responseJson.addProperty("message", "Mobile number already used");

            } else {
                //mobile no not used - new user

                Employee employee = new Employee();
                employee.setFirst_name(firstName);
                employee.setLast_name(lastName);
                employee.setDepartment(department);
                employee.setJobrole(jobrole);
                employee.setMobile(mobile);
                employee.setEmail(email);
                employee.setPasskey(password);
                employee.setRegistered_date_time(new Date());

                session.save(employee);//okkotm klin user save - img gna psse
                session.beginTransaction().commit();

                String subject = "Welcome to AttendEase!";
                String htmlContent = "<h1>Dear " + firstName + " " + lastName + ",</h1>"
                        + "<p>You have successfully registered to the AttendEase System.</p>"
                        + "<p><strong>Your Mobile Number:</strong> <span style='background-color: #f0f8ff; color: #0073e6; padding: 3px 5px; border-radius: 4px;'>" + mobile + "</span></p>"
                        + "<p><strong>Your Passkey:</strong> <span style='background-color: #f0f8ff; color: #e63946; padding: 3px 5px; border-radius: 4px;'>" + password + "</span></p>"
                        + "<p>Use these credentials to access the system and mark your attendance.</p>"
                        + "<h3 style='color: #2e8b57;'>Instructions for Using the System:</h3>"
                        + "<ul style='color: #2e8b57;'>"
                        + "<li>On the keypad, the <strong><span style='background-color: #f0f8ff; color: #e63946; padding: 3px 5px; border-radius: 4px;'>*</span></strong> button acts as a <strong>Backspace</strong>.</li>"//*btn
                        + "<li>The <strong><span style='background-color: #f0f8ff; color: #e63946; padding: 3px 5px; border-radius: 4px;'>#</span></strong> button serves as the <strong>Enter</strong> key.</li>"//#btn
                        + "</ul>"
                        + "<p  style='color: #2e8b57;'>Please remember your Mobile Number and Passkey, as they are required to access the system.</p>"
                        + "<p>Best Regards,<br>AttendEase Team.</p>";

                new Thread(() -> Mail.sendMail(email, subject, htmlContent)).start();

                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "You have Successfully Registered to AttendEase - We have sent you an Email, Please Check your Inbox");

            }

            session.close();

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));//content sype ek set krl ek Json krl aye ywnwa

    }

}
