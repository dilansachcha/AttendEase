package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Attendance;
import entity.Attendance_Status;
import entity.Employee;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@WebServlet(name = "VerifyEmployee", urlPatterns = {"/VerifyEmployee"})
public class VerifyEmployee extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();

        JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);
        String mobile = requestJson.get("mobile").getAsString();
        String passkey = requestJson.get("passkey").getAsString();

        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = null;

        try {
            tx = session.beginTransaction();

            Criteria criteria = session.createCriteria(Employee.class);
            criteria.add(Restrictions.eq("mobile", mobile));
            criteria.add(Restrictions.eq("passkey", passkey));

            Employee emp = (Employee) criteria.uniqueResult();

            if (emp != null) {
                boolean isAttendanceHandled = handleAttendance(emp, session, responseJson);
                if (isAttendanceHandled) {
                    if (!responseJson.has("success")) {
                        responseJson.addProperty("success", true);
                        //responseJson.addProperty("message", "Attendance Processed.");
                    }
                }
            } else {
                responseJson.addProperty("success", false);
                responseJson.addProperty("message", "Invalid Info.");
            }

            tx.commit();
        } catch (Exception e) {
            if (tx != null) {
                tx.rollback();
            }
            responseJson.addProperty("success", false);
            responseJson.addProperty("error", e.getMessage());
        } finally {
            session.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

    private boolean handleAttendance(Employee emp, Session session, JsonObject responseJson) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date todayStart = calendar.getTime();

        Criteria attendanceCriteria = session.createCriteria(Attendance.class);
        attendanceCriteria.add(Restrictions.eq("employee_Id", emp));
        attendanceCriteria.add(Restrictions.ge("check_in_time", todayStart));

        Attendance attendance = (Attendance) attendanceCriteria.uniqueResult();

        if (attendance == null) {

            attendance = new Attendance();
            attendance.setEmployee_Id(emp);
            attendance.setCheck_in_time(new Date());

            Attendance_Status status = getAttendanceStatus(session, 2);
            attendance.setAttendance_Status(status);

            session.save(attendance);
            responseJson.addProperty("success", true); // Add success flag
            responseJson.addProperty("message", "Checking-In");
            return true;
        } else if (attendance.getCheck_out_time() == null) {
            attendance.setCheck_out_time(new Date());

            long durationMillis = attendance.getCheck_out_time().getTime() - attendance.getCheck_in_time().getTime();
            long hoursWorked = TimeUnit.MILLISECONDS.toHours(durationMillis);

            if (hoursWorked >= 8) {
                if (hoursWorked < 9) {
                    attendance.setAttendance_Status(getAttendanceStatus(session, 3)); // Full Day (ID 3)
                } else if (hoursWorked >= 9 && hoursWorked < 10) {
                    attendance.setAttendance_Status(getAttendanceStatus(session, 6)); // Overtime 1 Hour (ID 6)
                } else if (hoursWorked >= 10 && hoursWorked < 11) {
                    attendance.setAttendance_Status(getAttendanceStatus(session, 7)); // Overtime 2 Hours (ID 7)
                } else if (hoursWorked >= 11) {
                    attendance.setAttendance_Status(getAttendanceStatus(session, 8)); // Overtime > 3 Hours (ID 8)
                }
            } else if (hoursWorked >= 4) {
                attendance.setAttendance_Status(getAttendanceStatus(session, 4)); // Half Day (ID 4)
            } else {
                attendance.setAttendance_Status(getAttendanceStatus(session, 5)); // No Pay (ID 5)
            }

            session.update(attendance);
            responseJson.addProperty("success", true); // Add success flag
            responseJson.addProperty("message", "Checking-Out");
            return true;
        } else {
            // Already checked out for the day
            responseJson.addProperty("success", false);
            responseJson.addProperty("message", "Already Out!");
            return false;
        }
    }

    private Attendance_Status getAttendanceStatus(Session session, int statusId) {
        Criteria statusCriteria = session.createCriteria(Attendance_Status.class);
        statusCriteria.add(Restrictions.eq("id", statusId));
        return (Attendance_Status) statusCriteria.uniqueResult();
    }
}