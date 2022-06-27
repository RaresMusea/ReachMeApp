package com.reachme.misc;

import java.sql.Timestamp;

/**<h1>Clasa auxiliara EditPostPayload</h1>
 * <h3>Se va utiliza aceasta clasa drept payload in momentul utilizarii metodei PATCH, ce are ca efect editarea parametrilor unei postari.</h3>
 */
public class EditPostPayload {

    /**<b>Noua descriere a postarii</b>*/
    private String description;

    /**<b>Noua locatie a postarii</b>*/
    private String location;

    /**<b>Timestamp ce indica data si ora la care au fost efectuate ultimele actualizari la nivelul unei entitati de tip postare</b>*/
    private Timestamp timestamp;

    /**<h1>Constructori clasa EditPostPayload</h1>
     * <h3>Constructor de initializare</h3>
     */
    public EditPostPayload(String description, String location, Timestamp timestamp){
        this.description=description;
        this.location=location;
        this.timestamp=timestamp;
    }

    /**<h1>Metode accesor si mutator specifice clasei EditPostPayload (getters & setters)</h1>*/
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
