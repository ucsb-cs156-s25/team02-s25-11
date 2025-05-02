const recommendationRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "user1@ucsb.edu",
    professorEmail: "professor1@ucsb.edu",
    explanation: "recommendation 1",
    dateRequested: "2022-01-02T12:00:00",
    dateNequested: "2022-01-04T12:00:00",
    done: true,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "user1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "recommendation 1",
      dateRequested: "2022-01-02T12:00:00",
      dateNequested: "2022-01-04T12:00:00",
      done: true,
    },
    {
      id: 2,
      requesterEmail: "user2@ucsb.edu",
      professorEmail: "professor2@ucsb.edu",
      explanation: "recommendation 2",
      dateRequested: "2022-02-02T12:00:00",
      dateNequested: "2022-02-04T12:00:00",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "user3@ucsb.edu",
      professorEmail: "professor3@ucsb.edu",
      explanation: "recommendation 3",
      dateRequested: "2022-01-06T12:00:00",
      dateNequested: "2022-01-07T12:00:00",
      done: true,
    },
  ],
};

export { recommendationRequestFixtures };
