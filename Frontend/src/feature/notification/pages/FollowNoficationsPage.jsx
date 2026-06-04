import { useEffect } from "react";
import { useNotification } from "../hook/useNotification.js";
import "../style/notification.scss";
import PageHeader from "../../../Componenet/Pageheader";

const FollowNotificationPage = () => {

    const {
        notifications,
        handleGetNotifications,
        handleGetUnreadCount,
        handleMarkAllAsRead
    } = useNotification();

    useEffect(() => {

        const init = async () => {
            await handleGetNotifications();

            // page open hote hi unread reset
            await handleMarkAllAsRead();

            // navbar badge update
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