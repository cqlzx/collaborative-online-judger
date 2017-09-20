// let problems = [
//     {
//         id: 1,
//         name: 'Two Sum',
//         description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.\n' +
//         '\n' +
//         'You may assume that each input would have exactly one solution, and you may not use the same element twice.',
//         difficulty: 'easy'
//     },
//     {
//         id: 2,
//         name: 'Add Two Numbers',
//         description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.\n' +
//         '\n' +
//         'You may assume the two numbers do not contain any leading zero, except the number 0 itself.\n' +
//         '\n' +
//         'Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)\n' +
//         'Output: 7 -> 0 -> 8',
//         difficulty: 'medium'
//     },
//     {
//         id: 3,
//         name: 'Longest Substring Without Repeating Characters',
//         description: 'Given a string, find the length of the longest substring without repeating characters.\n' +
//         '\n' +
//         'Examples:\n' +
//         '\n' +
//         'Given "abcabcbb", the answer is "abc", which the length is 3.\n' +
//         '\n' +
//         'Given "bbbbb", the answer is "b", with the length of 1.\n' +
//         '\n' +
//         'Given "pwwkew", the answer is "wke", with the length of 3. Note that the answer must be a substring, "pwke" is a subsequence and not a substring.',
//         difficulty: 'hard'
//     },
//     {
//         id: 4,
//         name: 'Median of Two Sorted Arrays',
//         description: 'There are two sorted arrays nums1 and nums2 of size m and n respectively.\n' +
//         '\n' +
//         'Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
//         difficulty: 'super'
//     }
// ];

const ProblemModel = require('../models/problemModel');

const getProblems = function () {
    // return new Promise((resolve, reject) => {
    //     resolve(problems);
    // });
    return new Promise((resolve, reject) => {
        ProblemModel.find({}, (error, problems) => {
            if (error) {
                reject(error);
            } else {
                resolve(problems);
            }
        })
    });
};

const getProblem = function (id) {
    // return new Promise((resolve, reject) => {
    //     resolve(problems.find(problem => problem.id === id));
    // });
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({id: id}, (error, problem) => {
            if (error) {
                reject(error);
            } else {
                resolve(problem);
            }
        })
    });
};

const addProblem = function (newProblem) {
    // return new Promise((resolve, reject) => {
    //     if (problems.find(problem => problem.name === newProblem.name)) {
    //         reject('Problem name already exists!');
    //     } else {
    //         newProblem.id = problems.length + 1;
    //         problems.push(newProblem);
    //         resolve(newProblem);
    //     }
    // });
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({name: newProblem.name}, (error, problem) => {
            if (problem) {
                reject('Problem name exists!');
            } else {
                ProblemModel.count({}, (error, total) => {
                    newProblem.id = total + 1;
                    const mongoProblem = new ProblemModel(newProblem);
                    mongoProblem.save();
                    resolve(newProblem);
                })
            }
        })
    });
};

module.exports = {
    getProblems: getProblems,
    getProblem: getProblem,
    addProblem: addProblem
};