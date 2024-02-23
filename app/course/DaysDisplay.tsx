import { useEffect, useState } from "react";
import { setDefaultHighWaterMark } from "stream";
import { days } from "./CourseSchedule";

function DaysDisplay({
    days
}: {
    days: days
}) {
    const [monday, setMonday] = useState(500);
    const [tuesday, setTuesday] = useState(500);
    const [wednesday, setWednesday] = useState(500);
    const [thursday, setThursday] = useState(500);
    const [friday, setFriday] = useState(500);
    const [saturday, setSaturday] = useState(500);
    const [sunday, setSunday] = useState(500);

    useEffect(() => {
        if (days.monday) {
            setMonday(100)
        }

        if (days.tuesday) {
            setTuesday(100)
        }

        if (days.wednesday) {
            setWednesday(100)
        }

        if (days.thursday) {
            setThursday(100)
        }

        if (days.friday) {
            setFriday(100)
        }

        if (days.saturday) {
            setSaturday(100)
        }

        if (days.sunday) {
            setSunday(100)
        }
    }, []);


    return (
        <div className="flex flex-row">
            <p className={`text-md font-medium text-gray-${monday - 200} dark:text-gray-${monday}`}>M</p>
            <p className={`text-md font-medium text-gray-${tuesday - 200} dark:text-gray-${tuesday} pl-1`}>T</p>
            <p className={`text-md font-medium text-gray-${wednesday - 200} dark:text-gray-${wednesday} pl-1`}>W</p>
            <p className={`text-md font-medium text-gray-${thursday - 200} dark:text-gray-${thursday} pl-1`}>Th</p>
            <p className={`text-md font-medium text-gray-${friday - 200} dark:text-gray-${friday} pl-1`}>F</p>
            <p className={`text-md font-medium text-gray-${saturday - 200} dark:text-gray-${saturday} pl-1`}>S</p>
            <p className={`text-md font-medium text-gray-${sunday - 200} dark:text-gray-${sunday} pl-1`}>Su</p>
        </div>
    )
}

export default DaysDisplay;