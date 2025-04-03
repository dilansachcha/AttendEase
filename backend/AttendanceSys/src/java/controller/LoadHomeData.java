/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Attendance;
import entity.Employee;
import entity.Attendance_Status;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.JDBCType;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Projections;
import org.hibernate.type.StandardBasicTypes;
import org.hibernate.criterion.Order;

/**
 *
 * @author USER
 */
@WebServlet(name = "ChatLoadHomeData", urlPatterns = {"/ChatLoadHomeData"})
public class LoadHomeData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        responseJson.addProperty("message", "Unable to process your request");

        try {
            // Open Hibernate session
            Session session = HibernateUtil.getSessionFactory().openSession();

// Fetch attendance data with employee and status joins (retrieve full entities)
            Criteria criteria = session.createCriteria(Attendance.class)
                    .createAlias("employee_Id", "employee") // Join with Employee entity
                    .createAlias("attendance_Status", "status") // Join with Attendance_Status entity
                    .addOrder(Order.desc("check_in_time")) // Initial order by check-in
                    .addOrder(Order.desc("check_out_time")); // Then order by check-out

            List<Attendance> attendanceList = criteria.list();

// Sort the list manually to ensure the latest time (check-in or check-out) is considered
            attendanceList.sort((a1, a2) -> {
                // Get the latest time between check-in and check-out for both attendance records
                Date latestTime1 = a1.getCheck_in_time() != null && a1.getCheck_out_time() != null
                        ? (a1.getCheck_in_time().after(a1.getCheck_out_time()) ? a1.getCheck_in_time() : a1.getCheck_out_time())
                        : a1.getCheck_in_time() != null ? a1.getCheck_in_time() : a1.getCheck_out_time();

                Date latestTime2 = a2.getCheck_in_time() != null && a2.getCheck_out_time() != null
                        ? (a2.getCheck_in_time().after(a2.getCheck_out_time()) ? a2.getCheck_in_time() : a2.getCheck_out_time())
                        : a2.getCheck_in_time() != null ? a2.getCheck_in_time() : a2.getCheck_out_time();

                return latestTime2.compareTo(latestTime1); // Descending order
            });

// Create JSON array for attendance data
            JsonArray attendanceJsonArray = new JsonArray();
            SimpleDateFormat timeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            for (Attendance attendance : attendanceList) {
                JsonObject attendanceJson = new JsonObject();

                // Add employee details
                Employee employee = attendance.getEmployee_Id();
                attendanceJson.addProperty("employee_id", employee.getId());
                attendanceJson.addProperty("first_name", employee.getFirst_name());
                attendanceJson.addProperty("last_name", employee.getLast_name());
                attendanceJson.addProperty("email", employee.getEmail());
                attendanceJson.addProperty("mobile", employee.getMobile());
                attendanceJson.addProperty("passkey", employee.getPasskey());
                attendanceJson.addProperty("department", employee.getDepartment());
                attendanceJson.addProperty("jobrole", employee.getJobrole());

                // Add attendance details
                attendanceJson.addProperty("check_in_time", timeFormat.format(attendance.getCheck_in_time()));

                // Handle null check for check_out_time
                if (attendance.getCheck_out_time() != null) {
                    attendanceJson.addProperty("check_out_time", timeFormat.format(attendance.getCheck_out_time()));
                } else {
                    attendanceJson.addProperty("check_out_time", "Not Checked Out Yet");
                }

                // Add attendance status
                Attendance_Status status = attendance.getAttendance_Status();
                attendanceJson.addProperty("attendance_status", status.getStatus());

                // Add attendance JSON object to the array
                attendanceJsonArray.add(attendanceJson);
            }

// Build response JSON
            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Attendance data retrieved successfully");
            responseJson.add("attendance", attendanceJsonArray);

// Close session
            session.close();

        } catch (Exception e) {
            e.printStackTrace(); // Debugging
            responseJson.addProperty("message", "Error: " + e.getMessage());
        }

        // Send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }
}
