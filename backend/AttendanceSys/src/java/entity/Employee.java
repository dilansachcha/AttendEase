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
import javax.persistence.Temporal;

@Entity
@Table(name = "employee")
public class Employee implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "mobile", length = 10, nullable = false)
    private String mobile;

    @Column(name = "email", length = 150, nullable = false)
    private String email;

    @Column(name = "first_name", length = 45, nullable = false)
    private String first_name;

    @Column(name = "last_name", length = 45, nullable = false)
    private String last_name;

    @Column(name = "department", length = 45, nullable = false)
    private String department;

    @Column(name = "jobrole", length = 45, nullable = false)
    private String jobrole;

    @Column(name = "passkey", length = 20, nullable = false)
    private String passkey;

    @Column(name = "registered_date_time", nullable = false)
    private Date registered_date_time;

    public Employee() {
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
     * @return the mobile
     */
    public String getMobile() {
        return mobile;
    }

    /**
     * @param mobile the mobile to set
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * @return the first_name
     */
    public String getFirst_name() {
        return first_name;
    }

    /**
     * @param first_name the first_name to set
     */
    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    /**
     * @return the last_name
     */
    public String getLast_name() {
        return last_name;
    }

    /**
     * @param last_name the last_name to set
     */
    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    /**
     * @return the department
     */
    public String getDepartment() {
        return department;
    }

    /**
     * @param department the department to set
     */
    public void setDepartment(String department) {
        this.department = department;
    }

    /**
     * @return the jobrole
     */
    public String getJobrole() {
        return jobrole;
    }

    /**
     * @param jobrole the jobrole to set
     */
    public void setJobrole(String jobrole) {
        this.jobrole = jobrole;
    }

    /**
     * @return the passkey
     */
    public String getPasskey() {
        return passkey;
    }

    /**
     * @param passkey the passkey to set
     */
    public void setPasskey(String passkey) {
        this.passkey = passkey;
    }

    /**
     * @return the registered_date_time
     */
    public Date getRegistered_date_time() {
        return registered_date_time;
    }

    /**
     * @param registered_date_time the registered_date_time to set
     */
    public void setRegistered_date_time(Date registered_date_time) {
        this.registered_date_time = registered_date_time;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

}
