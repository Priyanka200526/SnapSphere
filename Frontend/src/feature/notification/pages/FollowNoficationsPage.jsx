import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hook/useNotification.js";
import "../style/notification.scss";
import PageHeader from "../../../Componenet/Pageheader";

const FollowNotificationPage = () => {

    const navigate = useNavigate();

    const {
        notifications,
        handleGetNotifications,
        handleGetUnreadCount,
        handleMarkAllAsRead
    } = useNotification();

    useEffect(() => {

        const init = async () => {
            await handleGetNotifications();
            await handleMarkAllAsRead();
            await handleGetUnreadCount();
        };

        init();

    }, []);

    const formatTimestamp = (dateString) => {
        if (!dateString) return "";

        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;

        const diffInSecs = Math.floor(diffInMs / 1000);
        const diffInMins = Math.floor(diffInSecs / 60);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSecs < 60) return "Just now";
        if (diffInMins < 60) return `${diffInMins}m`;
        if (diffInHours < 24) return `${diffInHours}h`;
        return `${diffInDays}d`;
    };

    const getNotificationText = (type) => {
        switch (type) {
            case "follow":
                return "started following you.";
            case "like":
                return "liked your post.";
            case "comment":
                return "commented on your post.";
            default:
                return "sent a notification.";
        }
    };

    const handleNotificationClick = (item) => {
        if (item.type === "like" || item.type === "comment") {
            navigate(`/post/${item.postId}`);
        } else if (item.type === "follow" || item.type === "follow_accepted") {
            navigate(`/profile/${item.sender?._id}`);
        }
    };

    return (
        <div className="notification-page">

            <PageHeader />

            <div className="notification-container">

                <div className="notification-header">
                    <div className="header-title-area">
                        <h2>Notifications</h2>
                    </div>
                </div>

                <div className="notification-card-wrapper">

                    {!notifications || notifications.length === 0 ? (
                        <div className="notification-empty">
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <div
                                className="notification-row"
                                key={item._id}
                                onClick={() => handleNotificationClick(item)}
                            >
                                <div className="notification-meta">

                                    <div className="avatar-container">
                                        <img
                                            src={item.sender?.profileImage}
                                            alt={item.sender?.username}
                                            className="user-avatar"
                                        />
                                    </div>

                                    <div className="text-container">
                                        <div className="text-content">

                                            <span className="user-name">
                                                {item.sender?.username}
                                            </span>

                                            <span className="activity-text">
                                                {" "}
                                                {getNotificationText(item.type)}
                                            </span>

                                            <span className="time-stamp">
                                                {formatTimestamp(item.createdAt)}
                                            </span>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}

                </div>

            </div>

        </div>
    );
};

export default FollowNotificationPage;