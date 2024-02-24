"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useState } from "react";

interface Intructor {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
}

interface Course {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  hair_color: string;
}

export default function Explore() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCoursesList, setShowCoursesList] = useState(true);
  const [showProfList, setShowProfList] = useState(false);

  let courses_list = useAsyncList({
    async load({ signal }) {
      let res = await fetch("https://swapi.py4e.com/api/people/?search", {
        signal,
      });
      let json = await res.json();
      setIsLoading(false);

      return {
        items: json.results,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: any, b: any) => {
          let first = a[sortDescriptor.column as keyof Course];
          let second = b[sortDescriptor.column as keyof Course];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  let prof_list = useAsyncList({
    async load({ signal }) {
      let res = await fetch("https://swapi.py4e.com/api/people/?search", {
        signal,
      });
      let json = await res.json();
      setIsLoading(false);

      return {
        items: json.results,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: any, b: any) => {
          let first = a[sortDescriptor.column as keyof Intructor];
          let second = b[sortDescriptor.column as keyof Intructor];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  return (
    <div className="w-8/12 bg-center *:py-2 mt-5">
      <h1 className="text-3xl py-5 font-bold underline mt-5">
        View all courses and professors
      </h1>
      <div className="mt-5">
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium  text-lg px-10 py-2.5 text-center me-2 mb-2"
          onClick={() => {
            setShowCoursesList(true);
            setShowProfList(false);
          }}>
          Courses
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium  text-lg px-10 py-2.5 text-center me-2 mb-2"
          onClick={() => {
            setShowCoursesList(false);
            setShowProfList(true);
          }}>
          Instructors
        </button>
      </div>

      <Table
        sortDescriptor={
          showCoursesList
            ? courses_list.sortDescriptor
            : prof_list.sortDescriptor
        }
        onSortChange={showCoursesList ? courses_list.sort : prof_list.sort}
        classNames={{
          table: "min-h-[400px]",
        }}>
        {showCoursesList ? (
          <TableHeader>
            <TableColumn key="name" allowsSorting>
              Name
            </TableColumn>
            <TableColumn key="height" allowsSorting>
              Height
            </TableColumn>
            <TableColumn key="mass" allowsSorting>
              Mass
            </TableColumn>
            <TableColumn key="birth_year" allowsSorting>
              Birth year
            </TableColumn>
            <TableColumn key="birth_year" allowsSorting>
              Hair Color
            </TableColumn>
          </TableHeader>
        ) : (
          <TableHeader>
            <TableColumn key="name" allowsSorting>
              Name
            </TableColumn>
            <TableColumn key="height" allowsSorting>
              Height
            </TableColumn>
            <TableColumn key="mass" allowsSorting>
              Mass
            </TableColumn>
            <TableColumn key="birth_year" allowsSorting>
              Birth year
            </TableColumn>
          </TableHeader>
        )}
        <TableBody
          items={showCoursesList ? courses_list.items : prof_list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}>
          {(item: any) => (
            <TableRow key={item.name}>
              {(columnKey: any) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
