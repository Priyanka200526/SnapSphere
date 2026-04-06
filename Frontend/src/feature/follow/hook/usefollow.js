import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth.context'
import {
    followUserApi,
    unfollowUserApi, getFollowStatsApi
} from '../service/follow.api'
export const useAuth = () => {
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
    async function handleFollow(userId) {
        try {
            await followUserApi(userId);
            await handleFollowStats(); // refresh count
        } catch (err) {
            alert(err.response?.data?.message || "Follow failed");
        }
    }
    async function handleUnfollow(userId) {
        try {
            await unfollowUserApi(userId);
            await handleFollowStats();
        } catch (err) {
            alert(err.response?.data?.message || "Unfollow failed");
        }
    }


    useEffect(() => {
        handleFollowStats();
    }, [])
    return (
        {
            handleFollow,
            handleUnfollow,
            handleFollowStats,
            followStats,
            errors,
            setErrors,
        }
    )
}





