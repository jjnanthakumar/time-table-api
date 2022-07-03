import Rating from "../models/Rating.js";

export const getRating = async (req, res) => {
    const user = req.user;
    try {
        const rating = await Rating.findOne({
            senderId: user._id,
            receiverId: req.query.id,
            category: user.type === "recruiter" ? "applicant" : "job",
        })
        if (rating === null) {
            res.json({
                rating: -1,
            });
            return;
        }
        res.status(200).json({
            rating: rating.rating,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const addorupdateRating = async (req, res) => {
    const user = req.user;
    const data = req.body;
    if (user.type === "recruiter") {
        // can rate applicant
        Rating.findOne({
            senderId: user._id,
            receiverId: data.applicantId,
            category: "applicant",
        })
            .then((rating) => {
                if (rating === null) {
                    console.log("new rating");
                    Application.countDocuments({
                        userId: data.applicantId,
                        recruiterId: user._id,
                        status: {
                            $in: ["accepted", "finished"],
                        },
                    })
                        .then((acceptedApplicant) => {
                            if (acceptedApplicant > 0) {
                                // add a new rating

                                rating = new Rating({
                                    category: "applicant",
                                    receiverId: data.applicantId,
                                    senderId: user._id,
                                    rating: data.rating,
                                });

                                rating
                                    .save()
                                    .then(() => {
                                        // get the average of ratings
                                        Rating.aggregate([
                                            {
                                                $match: {
                                                    receiverId: mongoose.SchemaTypes.ObjectId(data.applicantId),
                                                    category: "applicant",
                                                },
                                            },
                                            {
                                                $group: {
                                                    _id: {},
                                                    average: { $avg: "$rating" },
                                                },
                                            },
                                        ])
                                            .then((result) => {
                                                // update the user's rating
                                                if (result === null) {
                                                    res.status(400).json({
                                                        message: "Error while calculating rating",
                                                    });
                                                    return;
                                                }
                                                const avg = result[0].average;

                                                JobApplicant.findOneAndUpdate(
                                                    {
                                                        userId: data.applicantId,
                                                    },
                                                    {
                                                        $set: {
                                                            rating: avg,
                                                        },
                                                    }
                                                )
                                                    .then((applicant) => {
                                                        if (applicant === null) {
                                                            res.status(400).json({
                                                                message:
                                                                    "Error while updating applicant's average rating",
                                                            });
                                                            return;
                                                        }
                                                        res.json({
                                                            message: "Rating added successfully",
                                                        });
                                                    })
                                                    .catch((err) => {
                                                        res.status(400).json(err);
                                                    });
                                            })
                                            .catch((err) => {
                                                res.status(400).json(err);
                                            });
                                    })
                                    .catch((err) => {
                                        res.status(400).json(err);
                                    });
                            } else {
                                // you cannot rate
                                res.status(400).json({
                                    message:
                                        "Applicant didn't worked under you. Hence you cannot give a rating.",
                                });
                            }
                        })
                        .catch((err) => {
                            res.status(400).json(err);
                        });
                } else {
                    rating.rating = data.rating;
                    rating
                        .save()
                        .then(() => {
                            // get the average of ratings
                            Rating.aggregate([
                                {
                                    $match: {
                                        receiverId: mongoose.SchemaTypes.ObjectId(data.applicantId),
                                        category: "applicant",
                                    },
                                },
                                {
                                    $group: {
                                        _id: {},
                                        average: { $avg: "$rating" },
                                    },
                                },
                            ])
                                .then((result) => {
                                    // update the user's rating
                                    if (result === null) {
                                        res.status(400).json({
                                            message: "Error while calculating rating",
                                        });
                                        return;
                                    }
                                    const avg = result[0].average;
                                    JobApplicant.findOneAndUpdate(
                                        {
                                            userId: data.applicantId,
                                        },
                                        {
                                            $set: {
                                                rating: avg,
                                            },
                                        }
                                    )
                                        .then((applicant) => {
                                            if (applicant === null) {
                                                res.status(400).json({
                                                    message:
                                                        "Error while updating applicant's average rating",
                                                });
                                                return;
                                            }
                                            res.json({
                                                message: "Rating updated successfully",
                                            });
                                        })
                                        .catch((err) => {
                                            res.status(400).json(err);
                                        });
                                })
                                .catch((err) => {
                                    res.status(400).json(err);
                                });
                        })
                        .catch((err) => {
                            res.status(400).json(err);
                        });
                }
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    } else {
        // applicant can rate job
        Rating.findOne({
            senderId: user._id,
            receiverId: data.jobId,
            category: "job",
        })
            .then((rating) => {
                console.log(rating);
                if (rating === null) {
                    console.log(rating);
                    Application.countDocuments({
                        userId: user._id,
                        jobId: data.jobId,
                        status: {
                            $in: ["accepted", "finished"],
                        },
                    })
                        .then((acceptedApplicant) => {
                            if (acceptedApplicant > 0) {
                                // add a new rating

                                rating = new Rating({
                                    category: "job",
                                    receiverId: data.jobId,
                                    senderId: user._id,
                                    rating: data.rating,
                                });

                                rating
                                    .save()
                                    .then(() => {
                                        // get the average of ratings
                                        Rating.aggregate([
                                            {
                                                $match: {
                                                    receiverId: mongoose.SchemaTypes.ObjectId(data.jobId),
                                                    category: "job",
                                                },
                                            },
                                            {
                                                $group: {
                                                    _id: {},
                                                    average: { $avg: "$rating" },
                                                },
                                            },
                                        ])
                                            .then((result) => {
                                                if (result === null) {
                                                    res.status(400).json({
                                                        message: "Error while calculating rating",
                                                    });
                                                    return;
                                                }
                                                const avg = result[0].average;
                                                Job.findOneAndUpdate(
                                                    {
                                                        _id: data.jobId,
                                                    },
                                                    {
                                                        $set: {
                                                            rating: avg,
                                                        },
                                                    }
                                                )
                                                    .then((foundJob) => {
                                                        if (foundJob === null) {
                                                            res.status(400).json({
                                                                message:
                                                                    "Error while updating job's average rating",
                                                            });
                                                            return;
                                                        }
                                                        res.json({
                                                            message: "Rating added successfully",
                                                        });
                                                    })
                                                    .catch((err) => {
                                                        res.status(400).json(err);
                                                    });
                                            })
                                            .catch((err) => {
                                                res.status(400).json(err);
                                            });
                                    })
                                    .catch((err) => {
                                        res.status(400).json(err);
                                    });
                            } else {
                                // you cannot rate
                                res.status(400).json({
                                    message:
                                        "You haven't worked for this job. Hence you cannot give a rating.",
                                });
                            }
                        })
                        .catch((err) => {
                            res.status(400).json(err);
                        });
                } else {
                    // update the rating
                    rating.rating = data.rating;
                    rating
                        .save()
                        .then(() => {
                            // get the average of ratings
                            Rating.aggregate([
                                {
                                    $match: {
                                        receiverId: mongoose.SchemaTypes.ObjectId(data.jobId),
                                        category: "job",
                                    },
                                },
                                {
                                    $group: {
                                        _id: {},
                                        average: { $avg: "$rating" },
                                    },
                                },
                            ])
                                .then((result) => {
                                    if (result === null) {
                                        res.status(400).json({
                                            message: "Error while calculating rating",
                                        });
                                        return;
                                    }
                                    const avg = result[0].average;
                                    console.log(avg);

                                    Job.findOneAndUpdate(
                                        {
                                            _id: data.jobId,
                                        },
                                        {
                                            $set: {
                                                rating: avg,
                                            },
                                        }
                                    )
                                        .then((foundJob) => {
                                            if (foundJob === null) {
                                                res.status(400).json({
                                                    message: "Error while updating job's average rating",
                                                });
                                                return;
                                            }
                                            res.json({
                                                message: "Rating added successfully",
                                            });
                                        })
                                        .catch((err) => {
                                            res.status(400).json(err);
                                        });
                                })
                                .catch((err) => {
                                    res.status(400).json(err);
                                });
                        })
                        .catch((err) => {
                            res.status(400).json(err);
                        });
                }
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    }
}