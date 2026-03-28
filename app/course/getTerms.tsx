export function getDefaultTab(): number {
	const month = new Date().getMonth()
	if (month < 4) return 3        // Jan–Mar  → Winter (tab 3)
	if (month < 9) return 1        // Apr–Aug  → Spring (tab 1)
	return 2                       // Sep–Dec  → Fall   (tab 2)
}

export function getTerms(pretty: boolean) {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const terms = {
        springTerm: "",
        fallTerm: "",
        winterTerm: "",
        nextSpringTerm: ""
    }

    if (pretty) {
        if (currentMonth >= 4) {
            terms.springTerm = `Spring ${currentYear}`
            terms.fallTerm = `Fall ${currentYear}`
            terms.winterTerm = `Winter ${currentYear + 1}`
            terms.nextSpringTerm = `Spring ${currentYear + 1}`
        } else {
            terms.springTerm = `Spring ${currentYear - 1}`
            terms.fallTerm = `Fall ${currentYear - 1}`
            terms.winterTerm = `Winter ${currentYear}`
            terms.nextSpringTerm = `Spring ${currentYear}`
        }
    } else {
        if (currentMonth >= 4) {
            terms.springTerm = `${currentYear}05`
            terms.fallTerm = `${currentYear}09`
            terms.winterTerm = `${currentYear + 1}01`
            terms.nextSpringTerm = `${currentYear + 1}05`
        } else {
            terms.springTerm = `${currentYear - 1}05`
            terms.fallTerm = `${currentYear - 1}09`
            terms.winterTerm = `${currentYear}01`
            terms.nextSpringTerm = `${currentYear}05`
        }
    }

    return terms
}