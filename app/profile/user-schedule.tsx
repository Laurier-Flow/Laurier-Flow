"use client";

import { useEffect, useState } from "react";
import { addClassesToSchedule, getUserSchedule } from "./user-data-functions";
import DaysDisplay from "../course/DaysDisplay";
import { days } from "../course/CourseSchedule";
import Spinner from "@/components/Spinner";

interface Schedule {
  deleteClassFunction: (id: number) => Promise<any>;
  addClassFunction: (
    term: string,
    course: string,
    instructor: string,
    location: string,
    time: string,
    date: string,
    type: string,
    grade: string
  ) => Promise<any>;
  updateClassFunction: (
    term: string,
    course: string,
    instructor: string,
    location: string,
    time: string,
    date: string,
    type: string,
    grade: string,
    id: number
  ) => Promise<any>;
}

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
}

interface UserTerm {
  term: string;
  classes: UserClasses[];
}

interface SortingInterface {
  term: string;
  id: number;
}

const Schedule: React.FC<Schedule> = ({
  deleteClassFunction,
  addClassFunction,
  updateClassFunction,
}) => {
  const [userPreExistingSchedule, setUserPreExistingSchedule] =
    useState<UserTerm[]>();

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);

  const [update, setUpdate] = useState<boolean>(false);
  const [addCourse, setAddCourse] = useState<boolean>(false);

  const [newClass, setNewClass] = useState<string>();
  const [newInstructor, setNewInstructor] = useState<string>();
  const [newLocation, setNewLocation] = useState<string>();
  const [newTime, setNewTime] = useState<string>();
  const [newDates, setNewDates] = useState<string>();
  const [newType, setNewType] = useState<string>();
  const [newGrade, setNewGrade] = useState<string>("");

  const [addNewTerm, setAddNewTerm] = useState<boolean>(false);
  const [newTermName, setNewTermName] = useState<string>("");

  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>();

  const [editSchedule, setEditSchedule] = useState<boolean>(false);
  const [editClass, setEditClass] = useState<string>();
  const [editInstructor, setEditInstructor] = useState<string>();
  const [editLocation, setEditLocation] = useState<string>();
  const [editTime, setEditTime] = useState<string>();
  const [editDate, setEditDate] = useState<string>();
  const [editType, setEditType] = useState<string>();
  const [editGrade, setEditGrade] = useState<string>();
  const [editId, setEditId] = useState<number>();
  const [editTerm, setEditTerm] = useState<string>();

  useEffect(() => {
    const getData = async () => {
      const data = await getUserSchedule();
      console.log(data);
      console.log(data.length > 0);
      if (data.length > 0) {
        var determineTermOrder: SortingInterface[] = [];
        const mapOfClasses: Map<number, UserClasses> = new Map();

        data.forEach((course: UserClasses) => {
          const sInt: SortingInterface = {
            term: course.term,
            id: course.id,
          };
          determineTermOrder.push(sInt);
          mapOfClasses.set(course.id, course);
        });

        // Sort the classes in lexicographical order so they appear in the proper term by term order
        determineTermOrder = determineTermOrder.sort(
          (a: SortingInterface, b: SortingInterface) =>
            a.term.localeCompare(b.term)
        );

        console.log("-----");
        const userTerms: UserTerm[] = [];

        // Set initial variables
        var classesInTerm: UserClasses[] = [];
        var currentTerm = determineTermOrder[0].term;

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
        console.log(userTerms);
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
    if (newTermName) {
      setError(false);
      setAddNewTerm(true);
    } else {
      setError(true);
      setErrorMsg("Please ensure a term name is added when adding a new term");
    }
  };

  const handleAddClassClick = () => {
    setAddCourse(true);
  };

  const handleSubmitChangesClick = async (term: string) => {
    // Ensure each field is completed (aside from grade, that one isn't mandatory)

    if (term && newClass && newInstructor && newTime && newDates && newType) {
      const res = await addClassFunction(
        term,
        newClass!,
        newInstructor!,
        newLocation!,
        newTime!,
        newDates!,
        newType!,
        newGrade
      );
      console.log(res);
      resetNewFields();
      setAddCourse(false);
      setAddNewTerm(false);
      setUpdate(true);
      setError(false);
      setErrorMsg("");
    } else {
      setError(true);
      setErrorMsg(
        "Please make sure all fields (aside from Grade if you want to leave it out) are filled out!"
      );
    }
  };

  const handleDeleteClassClick = async (id: number) => {
    const res = await deleteClassFunction(id);
    console.log(res);
    setUpdate(true);
  };

  const handleConvertingDateToDaysInterface = (date: string): days => {
    return {
      monday: date.includes("Monday"),
      tuesday: date.includes("Tuesday"),
      wednesday: date.includes("Wednesday"),
      thursday: date.includes("Thursday"),
      friday: date.includes("Friday"),
      saturday: date.includes("Saturday"),
      sunday: date.includes("Sunday"),
    };
  };

  const handleNewClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewClass(event.target.value);
  };

  const handleNewInstructorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewInstructor(event.target.value);
  };

  const handleNewLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewLocation(event.target.value);
  };

  const handleNewTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTime(event.target.value);
  };

  const handleNewDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    var str = "";
    selectedOptions.forEach((day: string) => {
      str += day + ",";
    });
    str = str.substring(0, str.length - 1);
    setNewDates(str);
    console.log(str);
  };

  const handleNewTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewType(event.target.value);
  };

  const handleNewGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrade(event.target.value);
  };

  const handleNewTermNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTermName(event.target.value);
  };

  const handleStartEditSchedule = (userClass: UserClasses) => {
    setEditClass(userClass.class);
    setEditInstructor(userClass.instructor);
    setEditLocation(userClass.location);
    setEditTime(userClass.time);
    setEditDate(userClass.date);
    setEditType(userClass.type);
    setEditGrade(userClass.grade);
    setEditId(userClass.id);
    setEditTerm(userClass.term);
    setEditSchedule(true);
  };

  const handleCancelEditSchedule = () => {
    setError(false);
    setEditSchedule(false);
  };

  const handleEditClass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditClass(event.target.value);
  };

  const handleEditInstructor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditInstructor(event.target.value);
  };

  const handleEditLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditLocation(event.target.value);
  };

  const handleEditTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTime(event.target.value);
  };

  const handleEditDate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    var str = "";
    selectedOptions.forEach((day: string) => {
      str += day + ",";
    });
    str = str.substring(0, str.length - 1);
    setEditDate(str);
    console.log(str);
  };

  const handleEditType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditType(event.target.value);
  };

  const handleEditGrade = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditGrade(event.target.value);
  };

  const handleSaveEditChanges = async () => {
    // Make sure none of the entries are null
    if (
      editClass &&
      editInstructor &&
      editInstructor &&
      editLocation &&
      editTime &&
      editDate &&
      editType
    ) {
      const res = await updateClassFunction(
        editTerm!,
        editClass!,
        editInstructor!,
        editLocation!,
        editTime!,
        editDate!,
        editType!,
        editGrade!,
        editId!
      );
      console.log(res);
      setError(false);
      setUpdate(true);
      setEditSchedule(false);
    } else {
      setError(true);
      setErrorMsg(
        "Please ensure all fields (aside from Grade if not necessary) are filled out when editing your schedule"
      );
    }
  };

  const resetNewFields = () => {
    setNewClass("");
    setNewInstructor("");
    setNewLocation("");
    setNewTime("");
    setNewDates("");
    setNewType("");
    setNewGrade("");
  };

  return (
    <div className="mb-8 h-full">
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
                style={{ width: "75vw" }}
                id="equal-width-elements-1"
                className="mt-5 mb-5"
                aria-labelledby="equal-width-elements-item-1">
                <h1 className="mb-2 text-xl font-bold md:text-xl text-black">
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
                                className
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
                            {term.classes.map(
                              (userClass: UserClasses, index: number) => {
                                return editSchedule &&
                                  editId === userClass.id ? (
                                  <tr>
                                    <td>
                                      <input
                                        type="text"
                                        id="class_name"
                                        className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editClass}
                                        onChange={handleEditClass}
                                        required={true}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="instructor_name"
                                        className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editInstructor}
                                        onChange={handleEditInstructor}
                                        required
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="location_name"
                                        className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editLocation}
                                        onChange={handleEditLocation}
                                        required
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="new_time"
                                        className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="8:30 AM - 9:30 AM"
                                        value={editTime}
                                        onChange={handleEditTime}
                                        required
                                      />
                                    </td>
                                    <td>
                                      <form className="max-w-sm mx-auto">
                                        <select
                                          multiple
                                          onChange={handleEditDate}
                                          id="dates_multiple"
                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                          <option
                                            value="Monday"
                                            selected={editDate?.includes(
                                              "Monday"
                                            )}>
                                            Monday
                                          </option>
                                          <option
                                            value="Tuesday"
                                            selected={editDate?.includes(
                                              "Tuesday"
                                            )}>
                                            Tuesday
                                          </option>
                                          <option
                                            value="Wednesday"
                                            selected={editDate?.includes(
                                              "Wednesday"
                                            )}>
                                            Wednesday
                                          </option>
                                          <option
                                            value="Thursday"
                                            selected={editDate?.includes(
                                              "Thursday"
                                            )}>
                                            Thursday
                                          </option>
                                          <option
                                            value="Friday"
                                            selected={editDate?.includes(
                                              "Friday"
                                            )}>
                                            Friday
                                          </option>
                                          <option
                                            value="Saturday"
                                            selected={editDate?.includes(
                                              "Saturday"
                                            )}>
                                            Saturday
                                          </option>
                                          <option
                                            value="Sunday"
                                            selected={editDate?.includes(
                                              "Sunday"
                                            )}>
                                            Sunday
                                          </option>
                                        </select>
                                      </form>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="new_type"
                                        className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editType}
                                        onChange={handleEditType}
                                        required
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        id="new_grade"
                                        className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={editGrade}
                                        onChange={handleEditGrade}
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
                                          days={handleConvertingDateToDaysInterface(
                                            userClass.date
                                          )}
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
                                          handleDeleteClassClick(userClass.id);
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
                                    className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="BU111"
                                    onChange={handleNewClassChange}
                                    required={true}
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
                                  <form className="max-w-sm mx-auto">
                                    <select
                                      multiple
                                      onChange={handleNewDateChange}
                                      id="dates_multiple"
                                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                      <option value="Monday">Monday</option>
                                      <option value="Tuesday">Tuesday</option>
                                      <option value="Wednesday">
                                        Wednesday
                                      </option>
                                      <option value="Thursday">Thursday</option>
                                      <option value="Friday">Friday</option>
                                      <option value="Saturday">Saturday</option>
                                      <option value="Sunday">Sunday</option>
                                    </select>
                                  </form>
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
                                      resetNewFields();
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
                                  handleSubmitChangesClick(term.term);
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
              <h1 className="mb-2 mt-5 text-xl font-bold md:text-xl text-black">
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
                              <form className="max-w-sm mx-auto">
                                <select
                                  multiple
                                  onChange={handleNewDateChange}
                                  id="dates_multiple"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                                  <option value="Saturday">Saturday</option>
                                  <option value="Sunday">Sunday</option>
                                </select>
                              </form>
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
                                  resetNewFields();
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
                              handleSubmitChangesClick(newTermName);
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
                className="text-sm mt-2 font-semibold rounded-lg border border-transparent bg-secondary text-black px-5 py-2.5 me-2 mb-2 dark:text-white disabled:opacity-50 disabled:pointer-events-none">
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
