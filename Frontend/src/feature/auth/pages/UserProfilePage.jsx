import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import "../style/userProfilePage.scss";
import PageHeader from "../../../Componenet/Pageheader"

const UserProfilePage = () => {

    const { id } = useParams();

    const {
        handleGetUserById,
        profileUser,
        loading,
        profilePosts
    } = useAuth();

    useEffect(() => {

        if (id) {
            handleGetUserById(id);
        }

    }, [id]);

    return (
        <div className="up-wrapper">
                <PageHeader />

            {/* LOADER */}
            {
                loading && (
                    <div className="up-loader">
                        Loading...
                    </div>
                )
            }

            {/* USER NOT FOUND */}
            {
                !loading && !profileUser && (
                    <p className="up-loading-text">
                        User not found
                    </p>
                )
            }

            {/* PROFILE */}
            {
                profileUser && (

                    <div className="up-container">

                        {/* HEADER */}
                        <div className="up-header">

                            <img
                                src={profileUser.profileImage}
                                alt={profileUser.username}
                                className="up-avatar"
                            />

                            <div className="up-details">

                                <h2>{profileUser.username}</h2>

                                <p>{profileUser.email}</p>

                                <div className="up-stats">

                                    <div>
                                        <span>{profileUser.postsCount}</span>
                                        <p>Posts</p>
                                    </div>

                                    <div>
                                        <span>{profileUser.followersCount}</span>
                                        <p>Followers</p>
                                    </div>

                                    <div>
                                        <span>{profileUser.followingCount}</span>
                                        <p>Following</p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* BIO */}
                        <div className="up-bio-box">

                            <h3>Bio</h3>

                            <p>
                                {profileUser.bio || "No bio added yet"}
                            </p>

                        </div>

                        {/* POSTS */}
                        <div className="up-post-grid">

                            {
                                profilePosts?.map((post) => (

                                    <div
                                        className="up-post-card"
                                        key={post._id}
                                    >

                                        <div className="up-scroll-container">

                                            {
                                                post.images?.map((img, index) => (

                                                    <div
                                                        className="up-image-wrapper"
                                                        key={index}
                                                    >

                                                        <img
                                                            src={img}
                                                            alt="post"
                                                            className="up-post-image"
                                                            loading="lazy"
                                                        />

                                                        {
                                                            post.images?.length > 1 && (

                                                                <div className="up-post-badge">
                                                                    {index + 1}/{post.images.length}
                                                                </div>

                                                            )
                                                        }

                                                    </div>

                                                ))
                                            }

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                )
            }

        </div>
    );
};

export default UserProfilePage;