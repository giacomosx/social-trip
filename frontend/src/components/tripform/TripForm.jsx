import React, {useEffect, useState} from 'react';
import Label from "../label/Label";
import TextInputField from "../textinputfield/TextInputField";
import LocationInputField from "../searchlocation/LocationInputField";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './tripform.css'
import Button from "../button/Button";
import AxiosApi from "../../api/axiosApi";
import Spinner from "../spinner/Spinner";
import Alerts from "../alerts/Alerts";
import {useNavigate} from "react-router-dom";

const TripForm = () => {
    const api = new AxiosApi();
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [destination, setDestination] = useState({});
    const [tripTypeSelected, setTripTypeSelected] = useState(null);
    const [infoTrip, setInfoTrip] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tripId, setTripId] = useState(null);
    const [tripCreated, setTripCreated] = useState(null);

    const [milestoneDestination, setMilestoneDestination] = useState({});
    const [milestoneDescription, setMilestoneDescription] = useState('');
    const [milestoneStartDate, setMilestoneStartDate] = useState(new Date());
    const [milestoneEndDate, setMilestoneEndDate] = useState(new Date());

    const tripTypes = ['relax', 'sport', 'job', 'family', 'honeymoon', 'adventure', 'shopping']

    const handleTripTypeChange = (e) => {
        setTripTypeSelected(e.target.innerText)
    }
    const handleChange = (e) => {
        setInfoTrip({
            ...infoTrip,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const tripData = {
                ...infoTrip,
                destination: destination,
                start_date: startDate,
                end_date: endDate,
                type: tripTypeSelected,
                public: true,
            }
            const createTrip = await api.post('/trips/create', tripData)
            if (createTrip.trip) {
                setTripId(createTrip.trip.tripId);
                setTripCreated(createTrip.trip);
            }

        } catch (e) {
            console.log(e)
            setError(true)
            setResponse('Something went wrong!')
            /*if (e.response.data.error) {
                setResponse(e.response.data.error)
            }
            if (e.response.data.errors) {
                setError(true)
                setResponse('Something went wrong!')
            }*/
            ;
        } finally {
            setLoading(false)
        }
    }

    const handleMilestoneDescription = (e) => {
        setMilestoneDescription(e.target.value);
    }

    const handleSubmitMilestones = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const milestoneData = {
                rel_trip: tripId,
                description: milestoneDescription,
                destination: milestoneDestination,
                start_date: milestoneStartDate,
                end_date: milestoneEndDate,
            }
            const createMilestone = await api.post('/milestones/create', milestoneData)
            if (createMilestone) {
                console.log(createMilestone);
            }

        } catch (e) {
            console.log(e)
            setError(true)
            setResponse('Something went wrong!')
            /*if (e.response.data.error) {
                setResponse(e.response.data.error)
            }
            if (e.response.data.errors) {
                setError(true)
                setResponse('Something went wrong!')
            }*/
            ;
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={'container max-w-2xl'}>
            {tripCreated && (
                <>
                    <div className={'trip-info mb-4'}>
                        <h1 className={'text-2xl text-gray-800 font-semibold ps-1'}>{tripCreated.name}</h1>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 ">
                            <svg className="min-w-4 h-4" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"/>
                            </svg>
                            <span className={'truncate'}>{tripCreated.destination?.destination_name}</span>
                        </div>
                    </div>
                </>
            )}
            <section
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700  h-fit">
                {loading && <Spinner/>}
                {!loading && error && <Alerts type={'danger'}>{response}</Alerts>}
                {!loading && !error && !tripId && (
                    <>
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create a new trip</h2>
                        <form className={'space-y-6'} onSubmit={handleSubmit}>
                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="sm:col-span-2">
                                    <Label htmlFor={'name'}>Trip Name</Label>
                                    <TextInputField onChange={handleChange}
                                                    placeholder={'Choose the name of your next trip'}
                                                    name={'name'}
                                                    type={'text'}/>
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor={'description'} variants={'font-medium text-sm'}>Description</Label>
                                    <TextInputField onChange={handleChange}
                                                    placeholder={'Type a simple description about your trip'}
                                                    name={'description'}
                                                    type={'text'}/>
                                </div>
                                <div className="sm:col-span-2 -mb-2">
                                    <Label htmlFor={'type'}>Select a trip type</Label>
                                    <div className="flex flex-wrap">
                                        {tripTypes.map((tripType, i) => (
                                            <span key={i}
                                                  onClick={handleTripTypeChange}
                                                  className={`border mb-2 flex items-center w-fit shrink-0 cursor-pointer transition-all bg-purple-100 text-purple-800 text-sm hover:border-purple-400 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-purple-400 dark:hover:bg-purple-100 ${tripType === tripTypeSelected ? 'border-purple-400' : 'border-white'}`}>

                                    {tripType}
                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full">
                                    <Label htmlFor={'destination'}>Destination</Label>
                                    <LocationInputField setLocation={setDestination} variants={'w-full max-w-[307px]'}/>
                                </div>
                                <div className="w-full">
                                    <Label htmlFor={'budget'}>Budget</Label>
                                    <TextInputField onChange={handleChange}
                                                    placeholder={'$ 2.300'}
                                                    name={'budget'}
                                                    type={'text'}/>
                                </div>
                                <div>
                                    <Label htmlFor={'startDate'}>Start date</Label>
                                    <DatePicker onChange={setStartDate}
                                                selected={startDate}
                                                name={'startDate'}
                                                onSelect={setStartDate}/>
                                </div>
                                <div>
                                    <Label htmlFor={'startDate'}>End date</Label>
                                    <DatePicker onChange={setEndDate}
                                                selected={endDate}
                                                name={'endDate'}
                                                onSelect={setEndDate}/>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variants={'rounded'} type={'submit'}>Next</Button>
                            </div>
                        </form>
                    </>

                )}
                {!loading && !error && tripId && (
                    <>

                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add milestones</h2>

                        <form className={'space-y-6'} onSubmit={handleSubmitMilestones}>
                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="sm:col-span-2">
                                    <Label htmlFor={'description'} variants={'font-medium text-sm'}>Description</Label>
                                    <TextInputField onChange={handleMilestoneDescription}
                                                    placeholder={'Type a simple description about your milestone'}
                                                    name={'description'}
                                                    type={'text'}/>
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor={'destination'}>Milestone destination</Label>
                                    <LocationInputField setLocation={setMilestoneDestination} variants={'w-full'}/>
                                </div>
                                <div>
                                    <Label htmlFor={'startDate'}>Start date</Label>
                                    <DatePicker onChange={setMilestoneStartDate}
                                                selected={milestoneStartDate}
                                                name={'startDate'}
                                                onSelect={setMilestoneStartDate}/>
                                </div>
                                <div>
                                    <Label htmlFor={'startDate'}>End date</Label>
                                    <DatePicker onChange={setMilestoneEndDate}
                                                selected={milestoneEndDate}
                                                name={'endDate'}
                                                onSelect={setMilestoneEndDate}/>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variants={'rounded'} type={'submit'}>Add</Button>
                            </div>
                        </form>
                    </>

                )}
            </section>
        </div>
    );
};

export default TripForm;
