package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "attendance")
public class Attendance implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "check_in_time", nullable = true)
    private Date check_in_time;

    @Column(name = "check_out_time", nullable = true)
    private Date check_out_time;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee_Id;

    @ManyToOne
    @JoinColumn(name = "attendance_status_id" )
    private Attendance_Status attendance_Status;    

    public Attendance() {
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the check_in_time
     */
    public Date getCheck_in_time() {
        return check_in_time;
    }

    /**
     * @param check_in_time the check_in_time to set
     */
    public void setCheck_in_time(Date check_in_time) {
        this.check_in_time = check_in_time;
    }

    /**
     * @return the check_out_time
     */
    public Date getCheck_out_time() {
        return check_out_time;
    }

    /**
     * @param check_out_time the check_out_time to set
     */
    public void setCheck_out_time(Date check_out_time) {
        this.check_out_time = check_out_time;
    }

    /**
     * @return the employee_Id
     */
    public Employee getEmployee_Id() {
        return employee_Id;
    }

    /**
     * @param employee_Id the employee_Id to set
     */
    public void setEmployee_Id(Employee employee_Id) {
        this.employee_Id = employee_Id;
    }

    /**
     * @return the attendance_Status
     */
    public Attendance_Status getAttendance_Status() {
        return attendance_Status;
    }

    /**
     * @param attendance_Status the attendance_Status to set
     */
    public void setAttendance_Status(Attendance_Status attendance_Status) {
        this.attendance_Status = attendance_Status;
    }
    
     

}
