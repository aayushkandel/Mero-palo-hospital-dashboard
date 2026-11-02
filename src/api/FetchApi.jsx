import api from "./Interceptor"


// Hospital login data
export const hospitalLogin=(credentials)=>{
    return api.post("/hospitals/login",credentials);
}

// get hospital profile
export const hospitalProfile=()=>{
    return api.get("/hospitals/profile")
}

// register hospital

export const hospitalRegister=(credentials)=>{
    return api.post("/hospitals/register",credentials)
}

// register department through hospital dashboard

export const departmentRegister=(credentials)=>{
    return api.post("/hospitals/depart_register",credentials)
}

// fetch all the departments related to a hospital

export const hospialAllDepartments=()=>{
    return api.get("/hospitals/all_department")
}

//post schedule by dates
export const postSchedulesByDates=(departId,schedules)=>{
    return api.post(`/hospitals/schedule/${departId}`,schedules)
}

// get single schedule by dates

export const getScheduleByDates = (departId, dates) => {
    return api.post(`/hospitals/single_schedule/${departId}`, dates);
};

// update schedule by dates

export const updateScheduleByDates=(departId,schedules)=>{
    return api.put(`/hospitals/update_schedule/${departId}`,schedules)
}

//get the departments profile 

export const getDepartmentProfile=(departId)=>{
    return api.get(`/hospitals/depart_profile/${departId}`)
}

//update department profile

export const updateDepartmentProfile=(depart_id,info)=>{
    return api.put(`/hospitals/update_department/${depart_id}`,info)
}

//delete the department

export const deleteDepartment=(depart_id)=>{
    return api.delete(`/hospitals/delete_department/${depart_id}`)
}

// change the department password

export const departPasswordChange=(depart_id,pass)=>{
    return api.put(`/hospitals/change_depart_password/${depart_id}`,pass)
}


// update the thumbnail of the hospital

export const updateHospitalThumbnail=(gallary_id)=>{
    return api.put(`/hospitals/update_thumbnail/${gallary_id}`)
}

// upload images into hospital gallary

export const uploadHospitalGallary=(images)=>{
    return api.post("/hospitals/upload_gallery",images)
}

// delete hospital gallary images 

export const deleteHospitalGallaryImages=(gallary_id)=>{
    return api.delete(`/hospitals/delete_gallery/${gallary_id}`)
}

// get hospital thumbnail
export const getHospitalThumbnail=()=>{
    return api.get("/hospitals/get_thumbnail")
}

//get hospital gallary images
export const getHospitalGallaryImages=()=>{
    return api.get("/hospitals/get_gallery")
}

// Get department gallery
export const getDepartmentGallary = (depart_id) => {
    return api.get(`/hospitals/department/${depart_id}/get_gallery`);
};


// Upload department gallery images
export const postDepartmentGallary = (depart_id, images) => {

    const formData = new FormData();

    images.forEach((image) => {
        formData.append("files", image);
    });

    return api.post(
        `/hospitals/department/${depart_id}/upload_gallery`,
        formData
    );
};


// Update department thumbnail
export const updateDepartmentThumbnail = (depart_id, gallery_id) => {
    return api.put(
        `/hospitals/department/${depart_id}/update_thumbnail/${gallery_id}`
    );
};


// Delete department gallery image
export const deleteDepartmentImage = (depart_id, gallery_id) => {
    return api.delete(
        `/hospitals/department/${depart_id}/delete_gallery/${gallery_id}`
    );
};


// Get department thumbnail
export const getDepartmentThumbnail = (depart_id) => {
    return api.get(
        `/hospitals/department/${depart_id}/get_thumbnail`
    );
};