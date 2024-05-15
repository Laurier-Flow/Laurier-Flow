'use client'

import { useEffect, useState } from "react";
import DaysDisplay from "../course/DaysDisplay";
import { days } from "../course/CourseSchedule";
import Spinner from "@/components/Spinner";
import {
  addClassesToSchedule,
  deleteSpecificClassFromSchedule,
  getUserSchedule,
  updateUserClass,
} from "./user-data-functions";

interface UserClasses {
  class: string;
  location: string;
  time: string;
  date: string;
  type: string;
  grade: string;
  id: number;
  term: string;
  instructor: string;
  section: string;
}

interface UserTerm {
	term: string
	classes: UserClasses[]
}

interface SortingInterface {
	term: string
	id: number
}

const Schedule = () => {
  const initialClassStatus: UserClasses = {
    class: "",
    instructor: "",
    section: "",
    location: "",
    time: "",
    date: "",
    type: "",
    grade: "",
    id: 0,
    term: "",
  };
  const initialDateStatus: days = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };

  const [userPreExistingSchedule, setUserPreExistingSchedule] =
    useState<UserTerm[]>();

	const [pageLoaded, setPageLoaded] = useState<boolean>(false)

  const [update, setUpdate] = useState<boolean>(false);
  const [addCourse, setAddCourse] = useState<boolean>(false);
  const [addNewTerm, setAddNewTerm] = useState<boolean>(false);

  const [newClass, setNewClass] = useState<UserClasses>(initialClassStatus);

  const [editSchedule, setEditSchedule] = useState<boolean>(false);
  const [editClass, setEditClass] = useState<UserClasses>(initialClassStatus);

  const [addClassDatesDisplay, setAddClassDatesDisplay] =
    useState<days>(initialDateStatus);

  const [editClassDatesDisplay, setEditClassDatesDisplay] =
    useState<days>(initialDateStatus);

	const [error, setError] = useState<boolean>(false)
	const [errorMsg, setErrorMsg] = useState<string>()

  const [newTermName, setNewTermName] = useState<string>();

  useEffect(() => {
    const getData = async () => {
      const data = await getUserSchedule();
      if (data.length > 0) {
        var determineTermOrder: SortingInterface[] = [];
        const mapOfClasses: Map<number, UserClasses> = new Map();

				data.forEach((course: UserClasses) => {
					const sInt: SortingInterface = {
						term: course.term,
						id: course.id
					}
					determineTermOrder.push(sInt)
					mapOfClasses.set(course.id, course)
				})

				// Sort the classes in lexicographical order so they appear in the proper term by term order
				determineTermOrder = determineTermOrder.sort(
					(a: SortingInterface, b: SortingInterface) =>
						a.term.localeCompare(b.term)
				)

        const userTerms: UserTerm[] = [];

				// Set initial variables
				var classesInTerm: UserClasses[] = []
				var currentTerm = determineTermOrder[0].term

        // Looping through all of the user's classes
        determineTermOrder.forEach((course: SortingInterface) => {
          // If we are still on the same term
          if (currentTerm === course.term) {
            // Add the classes to the same term
            classesInTerm.push(mapOfClasses.get(course.id)!);
          }
          // Otherwise
          else {
            // Create an object for its own term and add all classes within that term to the object
            userTerms.push({
              term: currentTerm,
              classes: classesInTerm,
            });
            // Reset the variables for the new term
            currentTerm = course.term;
            classesInTerm = [];
            classesInTerm.push(mapOfClasses.get(course.id)!);
          }
        });
        // The loop will terminate before being able to add the final term to the object so we do it outside the loop
        userTerms.push({
          term: currentTerm,
          classes: classesInTerm,
        });
        setUserPreExistingSchedule(userTerms);
      } else {
        setUserPreExistingSchedule(undefined);
      }
    };
    getData()
      .then(() => {
        setUpdate(false);
        setPageLoaded(true);
      })
      .catch(() => {
        setError(true);
        setErrorMsg(
          "An unexpected error has occured when attempting to display your schedule"
        );
      });
  }, [update]);

  const handleAddTermClick = () => {
    if (newTermName?.length! > 0) {
      setError(false);
      setAddNewTerm(true);
    } else {
      setError(true);
      setErrorMsg("Please ensure a term name is added when adding a new term");
    }
  };

  const handleNewTermNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTermName(event.target.value);
  };

  const handleAddClassClick = () => {
    setAddCourse(true);
  };

  const handleDeleteClass = async (id: number) => {
    const res = await deleteSpecificClassFromSchedule(id);
    setUpdate(true);
  };

  const handleNewClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var curClass: UserClasses = { ...newClass! };
    curClass.class = event.target.value;
    setNewClass(curClass);
  };

  const handleNewInstructorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var curClass: UserClasses = { ...newClass! };
    curClass.instructor = event.target.value;
    setNewClass(curClass);
  };

  const handleNewLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var curClass: UserClasses = { ...newClass! };
    curClass.location = event.target.value;
    setNewClass(curClass);
  };

  const handleNewTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var curClass: UserClasses = { ...newClass! };
    curClass.time = event.target.value;
    setNewClass(curClass);
  };

  const handleNewTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var curClass: UserClasses = { ...newClass! };
    curClass.type = event.target.value;
    setNewClass(curClass);
  };

  const handleNewGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var curClass: UserClasses = { ...newClass! };
    curClass.grade = event.target.value;
    setNewClass(curClass);
  };

  const handleNewSectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var curClass: UserClasses = { ...newClass! };
    curClass.section = event.target.value;
    setNewClass(curClass);
  };

  const handleEditClassChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var curClass: UserClasses = { ...editClass! };
    curClass.class = event.target.value;
    setEditClass(curClass);
  };

  const handleEditLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var curClass: UserClasses = { ...editClass! };
    curClass.location = event.target.value;
    setEditClass(curClass);
  };

  const handleEditTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var curClass: UserClasses = { ...editClass! };
    curClass.time = event.target.value;
    setEditClass(curClass);
  };

  const handleEditDateChange = (dateChanged: string) => {
    var curEditDays: days = editClassDatesDisplay!;

    if (dateChanged === "Monday") {
      if (curEditDays.monday) {
        curEditDays.monday = false;
      } else {
        curEditDays.monday = true;
      }
    }

    if (dateChanged === "Tuesday") {
      if (curEditDays.tuesday) {
        curEditDays.tuesday = false;
      } else {
        curEditDays.tuesday = true;
      }
    }

    if (dateChanged === "Wednesday") {
      if (curEditDays.wednesday) {
        curEditDays.wednesday = false;
      } else {
        curEditDays.wednesday = true;
      }
    }

    if (dateChanged === "Thursday") {
      if (curEditDays.thursday) {
        curEditDays.thursday = false;
      } else {
        curEditDays.thursday = true;
      }
    }

    if (dateChanged === "Friday") {
      if (curEditDays.friday) {
        curEditDays.friday = false;
      } else {
        curEditDays.friday = true;
      }
    }

    if (dateChanged === "Saturday") {
      if (curEditDays.saturday) {
        curEditDays.saturday = false;
      } else {
        curEditDays.saturday = true;
      }
    }

    if (dateChanged === "Sunday") {
      if (curEditDays.sunday) {
        curEditDays.sunday = false;
      } else {
        curEditDays.sunday = true;
      }
    }

    setEditClassDatesDisplay(curEditDays);
    var str = "";
    if (curEditDays.monday) {
      str += "Monday";
    }
    if (curEditDays.tuesday) {
      str += "Tuesday";
    }
    if (curEditDays.wednesday) {
      str += "Wednesday";
    }
    if (curEditDays.thursday) {
      str += "Thursday";
    }
    if (curEditDays.friday) {
      str += "Friday";
    }
    if (curEditDays.saturday) {
      str += "Saturday";
    }
    if (curEditDays.sunday) {
      str += "Sunday";
    }
    const curClass: UserClasses = { ...editClass };
    curClass.date = str;
    setEditClass(curClass);
  };

  const handleAddDateChange = (dateChanged: string) => {
    var curEditDays: days = addClassDatesDisplay!;

    if (dateChanged === "Monday") {
      if (curEditDays.monday) {
        curEditDays.monday = false;
      } else {
        curEditDays.monday = true;
      }
    }

    if (dateChanged === "Tuesday") {
      if (curEditDays.tuesday) {
        curEditDays.tuesday = false;
      } else {
        curEditDays.tuesday = true;
      }
    }

    if (dateChanged === "Wednesday") {
      if (curEditDays.wednesday) {
        curEditDays.wednesday = false;
      } else {
        curEditDays.wednesday = true;
      }
    }

    if (dateChanged === "Thursday") {
      if (curEditDays.thursday) {
        curEditDays.thursday = false;
      } else {
        curEditDays.thursday = true;
      }
    }

    if (dateChanged === "Friday") {
      if (curEditDays.friday) {
        curEditDays.friday = false;
      } else {
        curEditDays.friday = true;
      }
    }

    if (dateChanged === "Saturday") {
      if (curEditDays.saturday) {
        curEditDays.saturday = false;
      } else {
        curEditDays.saturday = true;
      }
    }

    if (dateChanged === "Sunday") {
      if (curEditDays.sunday) {
        curEditDays.sunday = false;
      } else {
        curEditDays.sunday = true;
      }
    }

    setAddClassDatesDisplay(curEditDays);
    var str = "";
    if (curEditDays.monday) {
      str += "Monday";
    }
    if (curEditDays.tuesday) {
      str += "Tuesday";
    }
    if (curEditDays.wednesday) {
      str += "Wednesday";
    }
    if (curEditDays.thursday) {
      str += "Thursday";
    }
    if (curEditDays.friday) {
      str += "Friday";
    }
    if (curEditDays.saturday) {
      str += "Saturday";
    }
    if (curEditDays.sunday) {
      str += "Sunday";
    }
    const curClass: UserClasses = { ...newClass };
    curClass.date = str;
    setNewClass(curClass);
  };

  const handleEditTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var curClass: UserClasses = { ...editClass! };
    curClass.type = event.target.value;
    setEditClass(curClass);
  };

  const handleEditGradeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var curClass: UserClasses = { ...editClass! };
    curClass.grade = event.target.value;
    setEditClass(curClass);
  };

  const handleEditTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var curClass: UserClasses = { ...editClass! };
    curClass.term = event.target.value;
    setEditClass(curClass);
  };

  const handleEditSectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var curClass: UserClasses = { ...editClass! };
    curClass.section = event.target.value;
    setEditClass(curClass);
  };

  const handleEditInstructorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var curClass: UserClasses = { ...editClass! };
    curClass.instructor = event.target.value;
    setEditClass(curClass);
  };

	const handleCancelEditSchedule = () => {
		setError(false)
		setEditSchedule(false)
	}

  const handleStartEditSchedule = (userClass: UserClasses) => {
    var editDays: days = {
      monday: userClass.date.includes("Monday"),
      tuesday: userClass.date.includes("Tuesday"),
      wednesday: userClass.date.includes("Wednesday"),
      thursday: userClass.date.includes("Thursday"),
      friday: userClass.date.includes("Friday"),
      saturday: userClass.date.includes("Saturday"),
      sunday: userClass.date.includes("Sunday"),
    };
    setEditClassDatesDisplay(editDays);

    setEditClass(userClass);

    setEditSchedule(true);
  };

  const handleSaveEditChanges = async () => {
    if (
      editClass?.class &&
      editClass.instructor &&
      editClass.location &&
      editClass.time &&
      editClass.date &&
      editClass.type &&
      editClass.section
    ) {
      const res = await updateUserClass(
        editClass.term,
        editClass.class,
        editClass.instructor,
        editClass.location,
        editClass.time,
        editClass.date,
        editClass.type,
        editClass.grade,
        editClass.id,
        editClass.section
      );
      setError(false);
      setUpdate(true);
      setTimeout(() => {
        setEditSchedule(false);
      }, 500);
    } else {
      setError(true);
      setErrorMsg(
        "Please ensure all fields (aside from Grade if not necessary) are filled out when editing your schedule"
      );
    }
  };

  const handleSubmitNewClasses = async (term: string) => {
    if (
      term &&
      newClass?.class &&
      newClass.instructor &&
      newClass.location &&
      newClass.time &&
      newClass.date &&
      newClass.type &&
      newClass.section
    ) {
      const res = await addClassesToSchedule(
        term,
        newClass.class,
        newClass.instructor,
        newClass.location,
        newClass.time,
        newClass.date,
        newClass.type,
        newClass.grade,
        newClass.section
      );
      if (res) {
        setAddCourse(false);
        setAddNewTerm(false);
        setUpdate(true);
        setError(false);
        setErrorMsg("");
        setNewClass(initialClassStatus);
        setNewTermName("");
      } else {
        setError(true);
        setErrorMsg(
          "Please ensure all fields (aside from Grade if not necessary) are filled out when adding a course to your schedule"
        );
        setNewTermName("");
      }
    }
    else {
        setError(true);
        setErrorMsg(
            "Please ensure all fields (aside from Grade if not necessary) are filled out when adding a course to your schedule"
          );
    }
  };
  return (
    <div className="mb-8 h-full customCard flex items-center justify-center">
      {error ? (
        <div
          className="mt-2 bg-red-500 text-sm text-white rounded-lg p-4"
          role="alert">
          <span className="font-bold">Error!</span> {errorMsg}
        </div>
      ) : null}
      {pageLoaded ? (
        <>
          {userPreExistingSchedule?.map((term: UserTerm, index: number) => {
            return (
              <div
                key={index}
                style={{ maxWidth: "65vw" }}
                id="equal-width-elements-1"
                className="mt-5 mb-5"
                aria-labelledby="equal-width-elements-item-1">
                <h1 className="mb-2 text-xl font-bold md:text-xl text-black dark:text-white">
                  {term.term}
                </h1>
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                Classname
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                Section
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                Instructor
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                Location
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                Time
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                Type
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                Grade
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {term.classes.map(
                              (userClass: UserClasses, index: number) => {
                                return editSchedule &&
                                  editClass.id === userClass.id ? (
                                  <tr>
                                    <td>
                                      <input
                                        type="text"
                                        id="class_name"
                                        className="mt-3 ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editClass.class}
                                        onChange={handleEditClassChange}
                                        required={true}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="section_name"
                                        className="mt-3 ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editClass.section}
                                        onChange={handleEditSectionChange}
                                        required={true}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="instructor_name"
                                        className="mt-3 ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-2/3 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editClass.instructor}
                                        onChange={handleEditInstructorChange}
                                        required={true}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="location_name"
                                        className="mt-3 ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editClass.location}
                                        onChange={handleEditLocationChange}
                                        required
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="new_time"
                                        className="mt-3 mr-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="8:30 AM - 9:30 AM"
                                        value={editClass.time}
                                        onChange={handleEditTimeChange}
                                        required
                                      />
                                    </td>
                                    <td>
                                      <div className="flex flex-row mt-1 ml-6 mr-2">
                                        <p
                                          onClick={() => {
                                            handleEditDateChange("Monday");
                                          }}
                                          className={`text-sm font-medium text-gray-${editClassDatesDisplay?.monday ? 100 : 200} dark:text-gray-${1}`}>
                                          M
                                        </p>
                                        <p
                                          onClick={() => {
                                            handleEditDateChange("Tuesday");
                                          }}
                                          className={`text-sm font-medium text-gray-${editClassDatesDisplay?.tuesday ? 100 : 200} dark:text-gray-${2} pl-1`}>
                                          T
                                        </p>
                                        <p
                                          onClick={() => {
                                            handleEditDateChange("Wednesday");
                                          }}
                                          className={`text-sm font-medium text-gray-${editClassDatesDisplay?.wednesday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                          W
                                        </p>
                                        <p
                                          onClick={() => {
                                            handleEditDateChange("Thursday");
                                          }}
                                          className={`text-sm font-medium text-gray-${editClassDatesDisplay?.thursday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                          T
                                        </p>
                                        <p
                                          onClick={() => {
                                            handleEditDateChange("Friday");
                                          }}
                                          className={`text-sm font-medium text-gray-${editClassDatesDisplay?.friday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                          F
                                        </p>
                                        <p
                                          onClick={() => {
                                            handleEditDateChange("Saturday");
                                          }}
                                          className={`text-sm font-medium text-gray-${editClassDatesDisplay?.saturday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                          S
                                        </p>
                                        <p
                                          onClick={() => {
                                            handleEditDateChange("Sunday");
                                          }}
                                          className={`text-sm font-medium text-gray-${editClassDatesDisplay?.sunday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                          Su
                                        </p>
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="new_type"
                                        className="mt-3 ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editClass.type}
                                        onChange={handleEditTypeChange}
                                        required
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="new_type"
                                        className="mt-3 ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editClass.grade}
                                        onChange={handleEditGradeChange}
                                        required
                                      />
                                    </td>
                                    <td>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCancelEditSchedule();
                                        }}
                                        type="button"
                                        className="ml-6 mt-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                        Cancel Edit
                                      </button>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {userClass.class}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {userClass.section}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {userClass.instructor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {userClass.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {userClass.time}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {
                                        <DaysDisplay
                                          days={{
                                            monday:
                                              userClass.date.includes("Monday"),
                                            tuesday:
                                              userClass.date.includes(
                                                "Tuesday"
                                              ),
                                            wednesday:
                                              userClass.date.includes(
                                                "Wednesday"
                                              ),
                                            thursday:
                                              userClass.date.includes(
                                                "Thursday"
                                              ),
                                            friday:
                                              userClass.date.includes("Friday"),
                                            saturday:
                                              userClass.date.includes(
                                                "Saturday"
                                              ),
                                            sunday:
                                              userClass.date.includes("Sunday"),
                                          }}
                                        />
                                      }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {userClass.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {userClass.grade}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      <button
                                        onClick={async (e) => {
                                          e.preventDefault();
                                          handleDeleteClass(userClass.id);
                                        }}
                                        type="button"
                                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                        Delete
                                      </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                      <button
                                        onClick={async (e) => {
                                          e.preventDefault();
                                          handleStartEditSchedule(userClass);
                                        }}
                                        type="button"
                                        className="text-sm font-semibold rounded-lg border border-transparent bg-secondary text-black px-5 py-2.5 me-2 mb-2 dark:text-white disabled:opacity-50 disabled:pointer-events-none">
                                        Edit
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                            {addCourse ? (
                              <tr>
                                <td>
                                  <input
                                    type="text"
                                    id="class_name"
                                    className="mt-3 ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="BU111"
                                    onChange={handleNewClassChange}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    id="section_name"
                                    className="mt-3 ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="B7"
                                    onChange={handleNewSectionChange}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    id="instructor_name"
                                    className="mt-3 ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Dave Swanston"
                                    onChange={handleNewInstructorChange}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    id="location_name"
                                    className="mt-3 ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="LH3094"
                                    onChange={handleNewLocationChange}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    id="new_time"
                                    className="mt-3 ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="8:30 AM - 9:30 AM"
                                    onChange={handleNewTimeChange}
                                    required
                                  />
                                </td>
                                <td>
                                  <div className="flex flex-row mt-1 ml-6 mr-2">
                                    <p
                                      onClick={() => {
                                        handleAddDateChange("Monday");
                                      }}
                                      className={`text-sm font-medium text-gray-${addClassDatesDisplay?.monday ? 100 : 200} dark:text-gray-${1}`}>
                                      M
                                    </p>
                                    <p
                                      onClick={() => {
                                        handleAddDateChange("Tuesday");
                                      }}
                                      className={`text-sm font-medium text-gray-${addClassDatesDisplay?.tuesday ? 100 : 200} dark:text-gray-${2} pl-1`}>
                                      T
                                    </p>
                                    <p
                                      onClick={() => {
                                        handleAddDateChange("Wednesday");
                                      }}
                                      className={`text-sm font-medium text-gray-${addClassDatesDisplay?.wednesday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                      W
                                    </p>
                                    <p
                                      onClick={() => {
                                        handleAddDateChange("Thursday");
                                      }}
                                      className={`text-sm font-medium text-gray-${addClassDatesDisplay?.thursday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                      T
                                    </p>
                                    <p
                                      onClick={() => {
                                        handleAddDateChange("Friday");
                                      }}
                                      className={`text-sm font-medium text-gray-${addClassDatesDisplay?.friday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                      F
                                    </p>
                                    <p
                                      onClick={() => {
                                        handleAddDateChange("Saturday");
                                      }}
                                      className={`text-sm font-medium text-gray-${addClassDatesDisplay?.saturday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                      S
                                    </p>
                                    <p
                                      onClick={() => {
                                        handleAddDateChange("Sunday");
                                      }}
                                      className={`text-sm font-medium text-gray-${addClassDatesDisplay?.sunday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                      Su
                                    </p>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    id="new_type"
                                    className="mt-3 ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Lecture"
                                    onChange={handleNewTypeChange}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    id="new_grade"
                                    className="mt-3 ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="9"
                                    onChange={handleNewGradeChange}
                                    required
                                  />
                                </td>
                                <td>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setAddCourse(false);
                                      setNewClass(initialClassStatus);
                                    }}
                                    type="button"
                                    className="ml-6 mt-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                    Cancel
                                  </button>
                                </td>
                              </tr>
                            ) : null}
                            {addCourse ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSubmitNewClasses(term.term);
                                }}
                                className="text-sm font-semibold rounded-lg border border-transparent bg-secondary text-black px-5 py-2.5 me-2 mb-2 dark:text-white disabled:opacity-50 disabled:pointer-events-none mt-2">
                                {" "}
                                Submit Changes
                              </button>
                            ) : editSchedule ? (
                              <button
                                type="button"
                                onClick={handleSaveEditChanges}
                                className="text-sm mt-2 font-semibold rounded-lg border border-transparent bg-secondary text-black px-5 py-2.5 me-2 mb-2 dark:text-white disabled:opacity-50 disabled:pointer-events-none">
                                {" "}
                                Save Changes
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleAddClassClick}
                                className="text-sm mt-2 font-semibold rounded-lg border border-transparent bg-secondary text-black px-5 py-2.5 me-2 mb-2 dark:text-white disabled:opacity-50 disabled:pointer-events-none">
                                {" "}
                                Add Course
                              </button>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="text-center"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <hr
                    className="mt-5"
                    style={{
                      width: "50%",
                      borderWidth: "1px",
                      borderRadius: "20px",
                      borderColor: "#F8BF3A",
                    }}
                  />
                </div>
              </div>
            );
          })}

          {addNewTerm ? (
            <>
              <h1 className="mb-2 mt-5 text-start text-xl font-bold md:text-xl text-black">
                {newTermName}
              </h1>
              <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                              className
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                              Section
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                              Instructor
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                              Location
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                              Time
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                              Type
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                              Grade
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr>
                            <td>
                              <input
                                type="text"
                                id="class_name"
                                className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="BU111"
                                onChange={handleNewClassChange}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                id="section_name"
                                className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="B7"
                                onChange={handleNewSectionChange}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                id="instructor_name"
                                className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Dave Swanston"
                                onChange={handleNewInstructorChange}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                id="location_name"
                                className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="LH3094"
                                onChange={handleNewLocationChange}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                id="new_time"
                                className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="8:30 AM - 9:30 AM"
                                onChange={handleNewTimeChange}
                                required
                              />
                            </td>
                            <td>
                              <div className="flex flex-row mt-1 ml-2 mr-2">
                                <p
                                  onClick={() => {
                                    handleAddDateChange("Monday");
                                  }}
                                  className={`text-sm font-medium text-gray-${addClassDatesDisplay?.monday ? 100 : 200} dark:text-gray-${1}`}>
                                  M
                                </p>
                                <p
                                  onClick={() => {
                                    handleAddDateChange("Tuesday");
                                  }}
                                  className={`text-sm font-medium text-gray-${addClassDatesDisplay?.tuesday ? 100 : 200} dark:text-gray-${2} pl-1`}>
                                  T
                                </p>
                                <p
                                  onClick={() => {
                                    handleAddDateChange("Wednesday");
                                  }}
                                  className={`text-sm font-medium text-gray-${addClassDatesDisplay?.wednesday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                  W
                                </p>
                                <p
                                  onClick={() => {
                                    handleAddDateChange("Thursday");
                                  }}
                                  className={`text-sm font-medium text-gray-${addClassDatesDisplay?.thursday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                  T
                                </p>
                                <p
                                  onClick={() => {
                                    handleAddDateChange("Friday");
                                  }}
                                  className={`text-sm font-medium text-gray-${addClassDatesDisplay?.friday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                  F
                                </p>
                                <p
                                  onClick={() => {
                                    handleAddDateChange("Saturday");
                                  }}
                                  className={`text-sm font-medium text-gray-${addClassDatesDisplay?.saturday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                  S
                                </p>
                                <p
                                  onClick={() => {
                                    handleAddDateChange("Sunday");
                                  }}
                                  className={`text-sm font-medium text-gray-${addClassDatesDisplay?.sunday ? 100 : 200} dark:text-gray-${3} pl-1`}>
                                  Su
                                </p>
                              </div>
                            </td>
                            <td>
                              <input
                                type="text"
                                id="new_type"
                                className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Lecture"
                                onChange={handleNewTypeChange}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                id="new_grade"
                                className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="9"
                                onChange={handleNewGradeChange}
                                required
                              />
                            </td>
                            <td>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setAddCourse(false);
                                  setAddNewTerm(false);
                                  setNewClass(initialClassStatus);
                                }}
                                type="button"
                                className="ml-6 mt-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                Cancel
                              </button>
                            </td>
                          </tr>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubmitNewClasses(newTermName!);
                            }}
                            className="text-sm font-semibold rounded-lg border border-transparent bg-secondary text-black px-5 py-2.5 me-2 mb-2 dark:text-white disabled:opacity-50 disabled:pointer-events-none mt-2">
                            {" "}
                            Submit Changes
                          </button>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label>Add New Term</label>
              <input
                type="text"
                id="class_name"
                className="mt-5 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1A"
                onChange={handleNewTermNameChange}
                required
              />
              <button
                type="button"
                onClick={handleAddTermClick}
                className="text-sm w-full mt-2 font-semibold rounded-lg border border-transparent bg-secondary text-black px-5 py-2.5 me-2 mb-2 dark:text-white disabled:opacity-50 disabled:pointer-events-none">
                {" "}
                Add Term
              </button>
            </div>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Schedule;
