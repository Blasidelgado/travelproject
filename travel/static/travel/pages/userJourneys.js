import fetchData from "../util/fetchData";

export default async function userJourneys() {
    const response = await fetchData('api/travel');
}