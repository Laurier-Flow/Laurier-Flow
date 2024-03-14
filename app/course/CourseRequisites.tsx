import React from "react";
import { courseInfoDBResponse, getCourseData } from "./CourseInfo";
import { SupabaseClient } from "@supabase/supabase-js";
import axios, { AxiosResponse } from "axios";
import * as cheerio from 'cheerio';
import { disciplineCodes } from "./disciplineCodes";
import { Link } from "@nextui-org/react";

export interface prerequisite {
    andOr: string,
    leftParentheses: string,
    rightParentheses: string,
    subject: string,
    courseNumber: string,
    level: string,
    grade: string
}

export interface restriction {
    text: string,
    bold: boolean
}

async function getRequisites(subjectCode: string, courseNumber: string) {
    try {
        const prerequisitesUrl = `https://loris.wlu.ca/register/ssb/courseSearchResults/getPrerequisites?term=202401&subjectCode=${subjectCode}&courseNumber=${courseNumber}`;
        const restrictionsUrl = `https://loris.wlu.ca/register/ssb/courseSearchResults/getRestrictions?term=202401&subjectCode=${subjectCode}&courseNumber=${courseNumber}`;

        const [prerequisitesResponse, restrictionsResponse] = await Promise.all([
            axios.get(prerequisitesUrl),
            axios.get(restrictionsUrl)
        ]);

        Promise.all([
            processPrerequisites(prerequisitesResponse),
            processRestrictions(restrictionsResponse)
        ]).then(([prerequisites, restrictions]) => {
            return { prerequisites, restrictions }
        }).catch(error => {
            console.error(error);
            return { prerequisites: [], restrictions: [] };
        });

        return { prerequisites: [], restrictions: [] };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { prerequisites: [], restrictions: [] };
    }
}

async function processPrerequisites(prerequisitesResponse: AxiosResponse) {
    const $ = cheerio.load(prerequisitesResponse.data);
    let prerequisites: any[] = [];
    $('section[aria-labelledby="preReqs"] tbody tr').each((index, element) => {
        const columns = $(element).find('td');
        prerequisites.push({
            andOr: $(columns[0]).text().trim().toLowerCase(),
            leftParentheses: $(columns[1]).text().trim(),
            rightParentheses: $(columns[8]).text().trim(),
            subject: $(columns[4]).text().trim(),
            courseNumber: $(columns[5]).text().trim(),
            level: $(columns[6]).text().trim(),
            grade: $(columns[7]).text().trim(),
        });
    });
    return prerequisites;
}

async function processRestrictions(restrictionsResponse: AxiosResponse) {
    const $ = cheerio.load(restrictionsResponse.data);
    let restrictions: any[] = [];
    $('span').each(function() {
        restrictions.push({
            text: $(this).text().trim(),
            bold: $(this).hasClass('status-bold'),
        });
    });
    return restrictions;
}


async function CourseRequisites({ supabase, courseName }: { supabase: SupabaseClient<any, "public", any>, courseName: string }) {
    const subjectCode = courseName.slice(0, 2);
    const courseNumber = courseName.slice(3);
    const requisites = await getRequisites(subjectCode, courseNumber)
    const prerequisites: prerequisite[] | undefined = requisites.prerequisites;
    const restrictions: restriction[] = requisites.restrictions;
    const courseData: courseInfoDBResponse[] = await getCourseData(supabase, courseName);

    return (
        <div className="flex flex-col p-4 lg:border-l lg:border-gray-300 lg:dark:border-gray-800 lg:pl-8 lg:w-1/3">
            <div>
                <h1 className="text-xl">{courseData[0].course_code} Prerequisites</h1>
                <h2 className="pt-2">
                    {prerequisites.length > 0 ? (
                        prerequisites.map((prerequisite: prerequisite, index) => (
                            <React.Fragment key={index}>
                                {' ' + prerequisite?.andOr} {prerequisite?.leftParentheses}
                                <b>
                                    {(prerequisite?.subject in disciplineCodes) ? (
                                        <Link className="underline text-black dark:text-white underline-offset-2" href={`/course/${disciplineCodes[prerequisite?.subject] + prerequisite?.courseNumber}`}>
                                            {disciplineCodes[prerequisite?.subject]} {prerequisite?.courseNumber}
                                        </Link>
                                    ) : (<>{prerequisite?.subject} {prerequisite?.courseNumber}</>)}
                                </b>{' '}
                                (Min. Grade {prerequisite?.grade}) {prerequisite?.rightParentheses}
                            </React.Fragment>
                        ))
                    ) : (
                        'No Prerequisite Information Available'
                    )}
                </h2>
            </div>

            <div className="mt-8">
                <h1 className="text-xl">{courseData[0].course_code} Restrictions</h1>
                <div className="pt-2">
                    {restrictions.length > 0 ? (
                        restrictions.map((restriction: restriction, index) => (
                            <h3 className={`${restriction.bold ? 'font-bold' : ''} ${(restriction.bold && index != 0) ? 'mt-2' : ''}`} key={index}>
                                {restriction.text}
                            </h3>
                        ))
                    ) : (
                        'No Restriction Information Available'
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseRequisites;