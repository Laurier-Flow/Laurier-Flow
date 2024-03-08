import React, { JSXElementConstructor, ReactElement, useEffect } from "react";
import WinBox from "react-winbox";
import "winbox/dist/css/winbox.min.css"; // required
import { useState } from "react";
type GPACalculatorProps = {
  title: string;
};

const GPACalculator: React.FC<GPACalculatorProps> = ({ title }) => {
  const [hide, setHide] = useState<boolean>(true);
  const [numCourses, setNumCourses] = useState<number>(3);
  const [courseObject, setCourseObject] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    console.log("here");
    var obj: React.JSX.Element[] = [];
    for (var i = 0; i < numCourses; i++) {
      obj.push(
        <div className="mt-5 ml-5 mr-5 mb-5 grid grid-cols-3 gap-3">
          <input
            type="text"
            id="course_code"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Course Code"
            required
          />
          <select
            id="weight"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="0.25">0.25</option>
            <option selected value="0.5">
              0.50
            </option>
            <option value="0.25">0.75</option>
            <option value="1.00">1.00</option>
            <option value="1.25">1.25</option>
          </select>
          <select
            id="grade"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>--Choose One--</option>
            <option value="12">12: A+ (90-100)</option>
            <option value="11">11: A (85-89)</option>
            <option value="10">10: A- (80-84)</option>
            <option value="9">9: B+ (77-79)</option>
            <option value="8">8: B (73-76)</option>
            <option value="7">7: B- (70-72)</option>
            <option value="6">6: C+ (67-69)</option>
            <option value="5">5: C (63-66)</option>
            <option value="4">4: C- (60-62)</option>
            <option value="3">3: D+ (57-59)</option>
            <option value="2">2: D (53-56)</option>
            <option value="1">1: D- (50-52)</option>
            <option value="0">0: F (0-49)</option>
            <option value="XF">0: XF* - A (0-49)</option>
            <option value="DR">0: DR** - A (0-49)</option>
          </select>
        </div>
      );
    }
    setCourseObject(
      obj.map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))
    );
  }, [numCourses]);

  return (
    <div>
      <button
        type="button"
        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium  text-lg px-10 py-2.5 text-center me-2 mb-2"
        onClick={() => {
          if (hide) {
            setHide(false);
          } else {
            setHide(true);
          }
        }}>
        GPA Calculator
      </button>
      <WinBox
        width={750}
        height={500}
        x="center"
        y={window.innerHeight / 4}
        hide={hide}
        title={title}
        noClose={true}>
        <div className="mt-5">
          <h1 className="text-center mb-4 font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text4xl dark:text-white">
            GPA Calculator
          </h1>
          <div className="mt-5 ml-5 mr-5 mb-5 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium  text-lg px-10 py-2.5 text-center me-2 mb-2"
              aria-label="num-courses"
              onClick={() => {
                var num = numCourses + 1;
                setNumCourses(num);
              }}>
              Add Course
            </button>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium  text-lg px-10 py-2.5 text-center me-2 mb-2"
              onClick={() => {
                var num = numCourses;
                if (numCourses > 1) {
                  num -= 1;
                  setNumCourses(num);
                }
              }}>
              Remove Course
            </button>
            <button
              type="button"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium text-lg px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => {
                alert("BRO UR FAILING!!!");
              }}>
              Calculate GPA
            </button>
          </div>
          <div className="mt-5 ml-5 mr-5 mb-5 grid grid-cols-3 gap-3">
            <label>Course Code</label>
            <label>Credit Weight</label>
            <label>Grade</label>
          </div>
        </div>
        <>{courseObject}</>
      </WinBox>
    </div>
  );
};
export default GPACalculator;
