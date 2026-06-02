import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../auth/context/auth.context'
import {
    toggleFollowApi, getFollowStatsApi, acceptFollowRequestApi, rejectFollowRequestApi
} from '../service/follow.api'
export const usefollow = () => {
    const context = useContext(AuthContext)
    const { errors, setErrors } = context

    const [followStats, setFollowStats] = useState({
        followers: 0,
        following: 0
    });

    async function handleFollowStats() {
        try {
            const data = await getFollowStatsApi();
            setFollowStats({
                followers: data.followers,
                following: data.following
            });
        } catch (err) {
            console.log(err);
        }
    }
    async function handleToggleFollow(userId) {

        try {

            const data = await toggleFollowApi(userId);

            await handleFollowStats();

            return data;

        } catch (err) {

            alert(
                err.response?.data?.message || "Action failed"
            );

        }

    }
    async function handleAcceptRequest(followId) {

        try {

            await acceptFollowRequestApi(followId);

            await handleGetNotifications();

        } catch (err) {

            console.log(err);

        }

    }

    async function handleRejectRequest(followId) {

        try {

            await rejectFollowRequestApi(followId);

            await handleGetNotifications();

        } catch (err) {

            console.log(err);

        }

    }

    useEffect(() => {
        handleFollowStats();
    }, [])
    return (
        {
            handleToggleFollow,
            handleFollowStats,
            handleAcceptRequest,
            handleRejectRequest,
            followStats,
            errors,
            setErrors,
        }
    )
}





