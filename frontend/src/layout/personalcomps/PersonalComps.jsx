import React from 'react';
import RightSidebarElement from "../../components/rightsidebarelement/RightSidebarElement";
import SavedTripsWidget from "../../components/savedtripswidget/SavedTripsWidget";
import StatisticsCard from "../../components/statisticscard/StatisticsCard";
import LatestFollowers from "../../components/latestfollowers/LatestFollowers";
import CtaCard from "../../components/ctacard/CtaCard";
import {useSelector} from "react-redux";
import {userState} from "../../redux/loginSlice";
import {useSession} from "../../hooks/useSession";

const PersonalComps = () => {
    const user = useSelector(userState)
    const {decodedSession} = useSession()
    return (
        <>
            {user.trips?.length === 0 && (
                <CtaCard title={'Begin Your Journey with Us!'} linkTitle={'Get Started'} linkUrl={'/trip/create'}>
                    Create your First Trip on DiscoveryTribe.
                    Share your stories and inspire others with your unique adventures.
                </CtaCard>
            )}
            {decodedSession && (
                <RightSidebarElement title={'About my journey'}>
                    <StatisticsCard userId={decodedSession.userId}/>
                </RightSidebarElement>
            )}
            {user.liked_trips?.length !== 0 && (
                <RightSidebarElement title={'Favorite trips'}>
                    <SavedTripsWidget userId={user._id}/>
                </RightSidebarElement>
            )}
            <RightSidebarElement title={'Latest Followers'} viewAllUrl={'/me/users'}>
                <LatestFollowers />
            </RightSidebarElement>
        </>
    );
};

export default PersonalComps;
