import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { hospialAllDepartments } from '../../api/FetchApi';

const DepartmentSidebar = ({arrowClass,subMenuButtonClass,handleItemClick  }) => {
 
      const [isMyDepartmentsOpen, setIsMyDepartmentsOpen] = useState(false);
      const [openRegistrationIds, setOpenRegistrationIds] = useState([]);
      const[hospitalDepart,setHospitalDepart]=useState([])
      const [isFetched, setIsFetched] = useState(false);

      const toggleRegistration = (departmentId) => {
    setOpenRegistrationIds((prev) =>
        prev.includes(departmentId)
            ? prev.filter((id) => id !== departmentId)
            : [...prev, departmentId]
    );
};


const handleClick = async () => {
    setIsMyDepartmentsOpen(prev => !prev);

    if (!isFetched) {
        try {
            const res = await hospialAllDepartments();

            setHospitalDepart(res.data);
            setIsFetched(true);
            console.log(res.data)

        } catch (error) {
            console.log(error);
        }
    }
};
    return (
    
    <>
    {/* My Departments */}
        <div>
       
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              My Departments
            </span>

            <svg
              className={arrowClass(isMyDepartmentsOpen)}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {isMyDepartmentsOpen && (
            <div className="mt-1 ml-4 pl-2 border-l border-gray-300 dark:border-gray-600 space-y-1">

       
          {hospitalDepart.map((curElem) => {
    const isOpen = openRegistrationIds.includes(curElem.id);

    return (
        
        <>

        <div key={curElem.id}>

            <button
                onClick={() => toggleRegistration(curElem.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-md"
            >
                <span>{curElem.name}</span>

                <svg
                    className={arrowClass(isOpen)}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="ml-3 mt-1 pl-2 border-l border-gray-300 space-y-1">

                    <NavLink to={`/mydepartments/schedules/${curElem.id}`}>
                        <button
                            onClick={() => handleItemClick("Registration Schedule")}
                            className={subMenuButtonClass("Registration Schedule")}
                        >
                            <span className="mr-2">•</span>
                            Schedule
                        </button>
                    </NavLink>
                    <NavLink to={`/mydepartments/profile/${curElem.id}`}>
                    <button
                        onClick={() => handleItemClick("Registration Profile")}
                        className={subMenuButtonClass("Registration Profile")}
                    >
                        <span className="mr-2">•</span>
                        Profile
                    </button></NavLink>

                </div>
            )}

        </div>
        </>
    );
})}
            
            </div>
          )}
        </div>
    </>
  )
}

export default DepartmentSidebar
