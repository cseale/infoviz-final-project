import * as d3 from 'd3';
import * as britecharts from 'britecharts';

let lineData = {
    "dataByTopic": [
      {
        "topic": 103,
        "topicName": "San Francisco",
        "dates":[
          {"date": "28-Jun-15", "value": 1, "dateUTC" : "2015-06-28T07:00:00.000Z"},
          {"date": "29-Jun-15", "value": 4, "dateUTC" : "2015-06-29T07:00:00.000Z"},
          {"date": "30-Jun-15", "value": 2, "dateUTC" : "2015-06-30T07:00:00.000Z"},
          {"date": "1-Jul-15", "value": 3, "dateUTC" : "2015-07-01T07:00:00.000Z"},
          {"date": "2-Jul-15", "value": 3, "dateUTC" : "2015-07-02T07:00:00.000Z"},
          {"date": "3-Jul-15", "value": 0, "dateUTC" : "2015-07-03T07:00:00.000Z"},
          {"date": "4-Jul-15", "value": 3, "dateUTC" : "2015-07-04T07:00:00.000Z"},
          {"date": "5-Jul-15", "value": 1, "dateUTC" : "2015-07-05T07:00:00.000Z"},
          {"date": "6-Jul-15", "value": 2, "dateUTC" : "2015-07-06T07:00:00.000Z"},
          {"date": "7-Jul-15", "value": 0, "dateUTC" : "2015-07-07T07:00:00.000Z"},
          {"date": "8-Jul-15", "value": 2, "dateUTC" : "2015-07-08T07:00:00.000Z"},
          {"date": "9-Jul-15", "value": 1, "dateUTC" : "2015-07-09T07:00:00.000Z"},
          {"date": "10-Jul-15", "value": 4, "dateUTC" : "2015-07-10T07:00:00.000Z"},
          {"date": "11-Jul-15", "value": 2, "dateUTC" : "2015-07-11T07:00:00.000Z"},
          {"date": "12-Jul-15", "value": 1, "dateUTC" : "2015-07-12T07:00:00.000Z"},
          {"date": "13-Jul-15", "value": 6, "dateUTC" : "2015-07-13T07:00:00.000Z"},
          {"date": "14-Jul-15", "value": 5, "dateUTC" : "2015-07-14T07:00:00.000Z"},
          {"date": "15-Jul-15", "value": 2, "dateUTC" : "2015-07-15T07:00:00.000Z"},
          {"date": "16-Jul-15", "value": 7, "dateUTC" : "2015-07-16T07:00:00.000Z"},
          {"date": "17-Jul-15", "value": 3, "dateUTC" : "2015-07-17T07:00:00.000Z"},
          {"date": "18-Jul-15", "value": 1, "dateUTC" : "2015-07-18T07:00:00.000Z"},
          {"date": "19-Jul-15", "value": 4, "dateUTC" : "2015-07-19T07:00:00.000Z"},
          {"date": "20-Jul-15", "value": 8, "dateUTC" : "2015-07-20T07:00:00.000Z"},
          {"date": "21-Jul-15", "value": 4, "dateUTC" : "2015-07-21T07:00:00.000Z"},
          {"date": "22-Jul-15", "value": 11, "dateUTC" : "2015-07-22T07:00:00.000Z"},
          {"date": "23-Jul-15", "value": 7, "dateUTC" : "2015-07-23T07:00:00.000Z"},
          {"date": "24-Jul-15", "value": 5, "dateUTC" : "2015-07-24T07:00:00.000Z"},
          {"date": "25-Jul-15", "value": 5, "dateUTC" : "2015-07-25T07:00:00.000Z"},
          {"date": "26-Jul-15", "value": 6, "dateUTC" : "2015-07-26T07:00:00.000Z"},
          {"date": "27-Jul-15", "value": 16, "dateUTC" : "2015-07-27T07:00:00.000Z"},
          {"date": "28-Jul-15", "value": 17, "dateUTC" : "2015-07-28T07:00:00.000Z"},
          {"date": "29-Jul-15", "value": 15, "dateUTC" : "2015-07-29T07:00:00.000Z"},
          {"date": "30-Jul-15", "value": 12, "dateUTC" : "2015-07-30T07:00:00.000Z"},
          {"date": "31-Jul-15", "value": 0, "dateUTC" : "2015-07-31T07:00:00.000Z"},
          {"date": "1-Aug-15", "value": 0, "dateUTC" : "2015-08-01T07:00:00.000Z"},
          {"date": "2-Aug-15", "value": 0, "dateUTC" : "2015-08-02T07:00:00.000Z"}
        ]
      },
      {
        "topic": 149,
        "topicName": "Unknown Location with a super hyper mega very very very long name.",
        "dates": [
          {"date": "27-Jun-15", "value": 0, "dateUTC" : "2015-06-27T07:00:00.000Z"},
          {"date": "28-Jun-15", "value": 2, "dateUTC" : "2015-06-28T07:00:00.000Z"},
          {"date": "29-Jun-15", "value": 4, "dateUTC" : "2015-06-29T07:00:00.000Z"},
          {"date": "30-Jun-15", "value": 3, "dateUTC" : "2015-06-30T07:00:00.000Z"},
          {"date": "1-Jul-15", "value": 1, "dateUTC" : "2015-07-01T07:00:00.000Z"},
          {"date": "2-Jul-15", "value": 3, "dateUTC" : "2015-07-02T07:00:00.000Z"},
          {"date": "3-Jul-15", "value": 3, "dateUTC" : "2015-07-03T07:00:00.000Z"},
          {"date": "4-Jul-15", "value": 1, "dateUTC" : "2015-07-04T07:00:00.000Z"},
          {"date": "5-Jul-15", "value": 2, "dateUTC" : "2015-07-05T07:00:00.000Z"},
          {"date": "6-Jul-15", "value": 2, "dateUTC" : "2015-07-06T07:00:00.000Z"},
          {"date": "7-Jul-15", "value": 4, "dateUTC" : "2015-07-07T07:00:00.000Z"},
          {"date": "8-Jul-15", "value": 7, "dateUTC" : "2015-07-08T07:00:00.000Z"},
          {"date": "9-Jul-15", "value": 1, "dateUTC" : "2015-07-09T07:00:00.000Z"},
          {"date": "10-Jul-15", "value": 5, "dateUTC" : "2015-07-10T07:00:00.000Z"},
          {"date": "11-Jul-15", "value": 9, "dateUTC" : "2015-07-11T07:00:00.000Z"},
          {"date": "12-Jul-15", "value": 5, "dateUTC" : "2015-07-12T07:00:00.000Z"},
          {"date": "13-Jul-15", "value": 2, "dateUTC" : "2015-07-13T07:00:00.000Z"},
          {"date": "14-Jul-15", "value": 8, "dateUTC" : "2015-07-14T07:00:00.000Z"},
          {"date": "15-Jul-15", "value": 3, "dateUTC" : "2015-07-15T07:00:00.000Z"},
          {"date": "16-Jul-15", "value": 1, "dateUTC" : "2015-07-16T07:00:00.000Z"},
          {"date": "17-Jul-15", "value": 2, "dateUTC" : "2015-07-17T07:00:00.000Z"},
          {"date": "18-Jul-15", "value": 7, "dateUTC" : "2015-07-18T07:00:00.000Z"},
          {"date": "19-Jul-15", "value": 1, "dateUTC" : "2015-07-19T07:00:00.000Z"},
          {"date": "20-Jul-15", "value": 5, "dateUTC" : "2015-07-20T07:00:00.000Z"},
          {"date": "21-Jul-15", "value": 0, "dateUTC" : "2015-07-21T07:00:00.000Z"},
          {"date": "22-Jul-15", "value": 2, "dateUTC" : "2015-07-22T07:00:00.000Z"},
          {"date": "23-Jul-15", "value": 5, "dateUTC" : "2015-07-23T07:00:00.000Z"},
          {"date": "24-Jul-15", "value": 2, "dateUTC" : "2015-07-24T07:00:00.000Z"},
          {"date": "25-Jul-15", "value": 2, "dateUTC" : "2015-07-25T07:00:00.000Z"},
          {"date": "26-Jul-15", "value": 3, "dateUTC" : "2015-07-26T07:00:00.000Z"},
          {"date": "27-Jul-15", "value": 8, "dateUTC" : "2015-07-27T07:00:00.000Z"},
          {"date": "28-Jul-15", "value": 11, "dateUTC" : "2015-07-28T07:00:00.000Z"},
          {"date": "29-Jul-15", "value": 17, "dateUTC" : "2015-07-29T07:00:00.000Z"},
          {"date": "30-Jul-15", "value": 14, "dateUTC" : "2015-07-30T07:00:00.000Z"},
          {"date": "31-Jul-15", "value": 0, "dateUTC" : "2015-07-31T07:00:00.000Z"},
          {"date": "1-Aug-15", "value": 0, "dateUTC" : "2015-08-01T07:00:00.000Z"},
          {"date": "2-Aug-15", "value": 0, "dateUTC" : "2015-08-02T07:00:00.000Z"}
        ]
      },
      {
        "topic": 60,
        "topicName": "Los Angeles",
        "dates": [
          {"date": "27-Jun-15", "value": 0, "dateUTC" : "2015-06-27T07:00:00.000Z"},
          {"date": "28-Jun-15", "value": 0, "dateUTC" : "2015-06-28T07:00:00.000Z"},
          {"date": "29-Jun-15", "value": 18, "dateUTC" : "2015-06-29T07:00:00.000Z"},
          {"date": "30-Jun-15", "value": 1, "dateUTC" : "2015-06-30T07:00:00.000Z"},
          {"date": "1-Jul-15", "value": 6, "dateUTC" : "2015-07-01T07:00:00.000Z"},
          {"date": "2-Jul-15", "value": 0, "dateUTC" : "2015-07-02T07:00:00.000Z"},
          {"date": "3-Jul-15", "value": 0, "dateUTC" : "2015-07-03T07:00:00.000Z"},
          {"date": "4-Jul-15", "value": 0, "dateUTC" : "2015-07-04T07:00:00.000Z"},
          {"date": "5-Jul-15", "value": 0, "dateUTC" : "2015-07-05T07:00:00.000Z"},
          {"date": "6-Jul-15", "value": 0, "dateUTC" : "2015-07-06T07:00:00.000Z"},
          {"date": "7-Jul-15", "value": 15, "dateUTC" : "2015-07-07T07:00:00.000Z"},
          {"date": "8-Jul-15", "value": 32, "dateUTC" : "2015-07-08T07:00:00.000Z"},
          {"date": "9-Jul-15", "value": 0, "dateUTC" : "2015-07-09T07:00:00.000Z"},
          {"date": "10-Jul-15", "value": 0, "dateUTC" : "2015-07-10T07:00:00.000Z"},
          {"date": "11-Jul-15", "value": 0, "dateUTC" : "2015-07-11T07:00:00.000Z"},
          {"date": "12-Jul-15", "value": 0, "dateUTC" : "2015-07-12T07:00:00.000Z"},
          {"date": "13-Jul-15", "value": 3, "dateUTC" : "2015-07-13T07:00:00.000Z"},
          {"date": "14-Jul-15", "value": 0, "dateUTC" : "2015-07-14T07:00:00.000Z"},
          {"date": "15-Jul-15", "value": 0, "dateUTC" : "2015-07-15T07:00:00.000Z"},
          {"date": "16-Jul-15", "value": 15, "dateUTC" : "2015-07-16T07:00:00.000Z"},
          {"date": "17-Jul-15", "value": 0, "dateUTC" : "2015-07-17T07:00:00.000Z"},
          {"date": "18-Jul-15", "value": 0, "dateUTC" : "2015-07-18T07:00:00.000Z"},
          {"date": "19-Jul-15", "value": 0, "dateUTC" : "2015-07-19T07:00:00.000Z"},
          {"date": "20-Jul-15", "value": 0, "dateUTC" : "2015-07-20T07:00:00.000Z"},
          {"date": "21-Jul-15", "value": 0, "dateUTC" : "2015-07-21T07:00:00.000Z"},
          {"date": "22-Jul-15", "value": 5, "dateUTC" : "2015-07-22T07:00:00.000Z"},
          {"date": "23-Jul-15", "value": 0, "dateUTC" : "2015-07-23T07:00:00.000Z"},
          {"date": "24-Jul-15", "value": 1, "dateUTC" : "2015-07-24T07:00:00.000Z"},
          {"date": "25-Jul-15", "value": 0, "dateUTC" : "2015-07-25T07:00:00.000Z"},
          {"date": "26-Jul-15", "value": 1, "dateUTC" : "2015-07-26T07:00:00.000Z"},
          {"date": "27-Jul-15", "value": 0, "dateUTC" : "2015-07-27T07:00:00.000Z"},
          {"date": "28-Jul-15", "value": 0, "dateUTC" : "2015-07-28T07:00:00.000Z"},
          {"date": "29-Jul-15", "value": 3, "dateUTC" : "2015-07-29T07:00:00.000Z"},
          {"date": "30-Jul-15", "value": 2, "dateUTC" : "2015-07-30T07:00:00.000Z"},
          {"date": "31-Jul-15", "value": 0, "dateUTC" : "2015-07-31T07:00:00.000Z"},
          {"date": "1-Aug-15", "value": 0, "dateUTC" : "2015-08-01T07:00:00.000Z"},
          {"date": "2-Aug-15", "value": 0, "dateUTC" : "2015-08-02T07:00:00.000Z"}
        ]
      },
      {
        "topic": 81,
        "topicName": "Oakland",
        "dates":[
          {"date": "27-Jun-15", "value": 0, "dateUTC" : "2015-06-27T07:00:00.000Z"},
          {"date": "28-Jun-15", "value": 0, "dateUTC" : "2015-06-28T07:00:00.000Z"},
          {"date": "29-Jun-15", "value": 1, "dateUTC" : "2015-06-29T07:00:00.000Z"},
          {"date": "30-Jun-15", "value": 0, "dateUTC" : "2015-06-30T07:00:00.000Z"},
          {"date": "1-Jul-15", "value": 0, "dateUTC" : "2015-07-01T07:00:00.000Z"},
          {"date": "2-Jul-15", "value": 0, "dateUTC" : "2015-07-02T07:00:00.000Z"},
          {"date": "3-Jul-15", "value": 0, "dateUTC" : "2015-07-03T07:00:00.000Z"},
          {"date": "4-Jul-15", "value": 0, "dateUTC" : "2015-07-04T07:00:00.000Z"},
          {"date": "5-Jul-15", "value": 0, "dateUTC" : "2015-07-05T07:00:00.000Z"},
          {"date": "6-Jul-15", "value": 0, "dateUTC" : "2015-07-06T07:00:00.000Z"},
          {"date": "7-Jul-15", "value": 0, "dateUTC" : "2015-07-07T07:00:00.000Z"},
          {"date": "8-Jul-15", "value": 0, "dateUTC" : "2015-07-08T07:00:00.000Z"},
          {"date": "9-Jul-15", "value": 1, "dateUTC" : "2015-07-09T07:00:00.000Z"},
          {"date": "10-Jul-15", "value": 0, "dateUTC" : "2015-07-10T07:00:00.000Z"},
          {"date": "11-Jul-15", "value": 1, "dateUTC" : "2015-07-11T07:00:00.000Z"},
          {"date": "12-Jul-15", "value": 1, "dateUTC" : "2015-07-12T07:00:00.000Z"},
          {"date": "13-Jul-15", "value": 0, "dateUTC" : "2015-07-13T07:00:00.000Z"},
          {"date": "14-Jul-15", "value": 2, "dateUTC" : "2015-07-14T07:00:00.000Z"},
          {"date": "15-Jul-15", "value": 3, "dateUTC" : "2015-07-15T07:00:00.000Z"},
          {"date": "16-Jul-15", "value": 0, "dateUTC" : "2015-07-16T07:00:00.000Z"},
          {"date": "17-Jul-15", "value": 0, "dateUTC" : "2015-07-17T07:00:00.000Z"},
          {"date": "18-Jul-15", "value": 0, "dateUTC" : "2015-07-18T07:00:00.000Z"},
          {"date": "19-Jul-15", "value": 2, "dateUTC" : "2015-07-19T07:00:00.000Z"},
          {"date": "20-Jul-15", "value": 7, "dateUTC" : "2015-07-20T07:00:00.000Z"},
          {"date": "21-Jul-15", "value": 0, "dateUTC" : "2015-07-21T07:00:00.000Z"},
          {"date": "22-Jul-15", "value": 1, "dateUTC" : "2015-07-22T07:00:00.000Z"},
          {"date": "23-Jul-15", "value": 2, "dateUTC" : "2015-07-23T07:00:00.000Z"},
          {"date": "24-Jul-15", "value": 0, "dateUTC" : "2015-07-24T07:00:00.000Z"},
          {"date": "25-Jul-15", "value": 0, "dateUTC" : "2015-07-25T07:00:00.000Z"},
          {"date": "26-Jul-15", "value": 0, "dateUTC" : "2015-07-26T07:00:00.000Z"},
          {"date": "27-Jul-15", "value": 1, "dateUTC" : "2015-07-27T07:00:00.000Z"},
          {"date": "28-Jul-15", "value": 2, "dateUTC" : "2015-07-28T07:00:00.000Z"},
          {"date": "29-Jul-15", "value": 2, "dateUTC" : "2015-07-29T07:00:00.000Z"},
          {"date": "30-Jul-15", "value": 6, "dateUTC" : "2015-07-30T07:00:00.000Z"},
          {"date": "31-Jul-15", "value": 0, "dateUTC" : "2015-07-31T07:00:00.000Z"},
          {"date": "1-Aug-15", "value": 0, "dateUTC" : "2015-08-01T07:00:00.000Z"},
          {"date": "2-Aug-15", "value": 0, "dateUTC" : "2015-08-02T07:00:00.000Z"}
        ]
      },
      {
        "topic": 0,
        "topicName": "Other",
        "dates": [
          {"date": "27-Jun-15", "value": 3, "dateUTC" : "2015-06-27T07:00:00.000Z"},
          {"date": "28-Jun-15", "value": 9, "dateUTC" : "2015-06-28T07:00:00.000Z"},
          {"date": "29-Jun-15", "value": 6, "dateUTC" : "2015-06-29T07:00:00.000Z"},
          {"date": "30-Jun-15", "value": 11, "dateUTC" : "2015-06-30T07:00:00.000Z"},
          {"date": "1-Jul-15", "value": 7, "dateUTC" : "2015-07-01T07:00:00.000Z"},
          {"date": "2-Jul-15", "value": 10, "dateUTC" : "2015-07-02T07:00:00.000Z"},
          {"date": "3-Jul-15", "value": 5, "dateUTC" : "2015-07-03T07:00:00.000Z"},
          {"date": "4-Jul-15", "value": 10, "dateUTC" : "2015-07-04T07:00:00.000Z"},
          {"date": "5-Jul-15", "value": 8, "dateUTC" : "2015-07-05T07:00:00.000Z"},
          {"date": "6-Jul-15", "value": 10, "dateUTC" : "2015-07-06T07:00:00.000Z"},
          {"date": "7-Jul-15", "value": 6, "dateUTC" : "2015-07-07T07:00:00.000Z"},
          {"date": "8-Jul-15", "value": 14, "dateUTC" : "2015-07-08T07:00:00.000Z"},
          {"date": "9-Jul-15", "value": 12, "dateUTC" : "2015-07-09T07:00:00.000Z"},
          {"date": "10-Jul-15", "value": 17, "dateUTC" : "2015-07-10T07:00:00.000Z"},
          {"date": "11-Jul-15", "value": 9, "dateUTC" : "2015-07-11T07:00:00.000Z"},
          {"date": "12-Jul-15", "value": 9, "dateUTC" : "2015-07-12T07:00:00.000Z"},
          {"date": "13-Jul-15", "value": 9, "dateUTC" : "2015-07-13T07:00:00.000Z"},
          {"date": "14-Jul-15", "value": 11, "dateUTC" : "2015-07-14T07:00:00.000Z"},
          {"date": "15-Jul-15", "value": 16, "dateUTC" : "2015-07-15T07:00:00.000Z"},
          {"date": "16-Jul-15", "value": 6, "dateUTC" : "2015-07-16T07:00:00.000Z"},
          {"date": "17-Jul-15", "value": 7, "dateUTC" : "2015-07-17T07:00:00.000Z"},
          {"date": "18-Jul-15", "value": 8, "dateUTC" : "2015-07-18T07:00:00.000Z"},
          {"date": "19-Jul-15", "value": 4, "dateUTC" : "2015-07-19T07:00:00.000Z"},
          {"date": "20-Jul-15", "value": 9, "dateUTC" : "2015-07-20T07:00:00.000Z"},
          {"date": "21-Jul-15", "value": 5, "dateUTC" : "2015-07-21T07:00:00.000Z"},
          {"date": "22-Jul-15", "value": 7, "dateUTC" : "2015-07-22T07:00:00.000Z"},
          {"date": "23-Jul-15", "value": 7, "dateUTC" : "2015-07-23T07:00:00.000Z"},
          {"date": "24-Jul-15", "value": 10, "dateUTC" : "2015-07-24T07:00:00.000Z"},
          {"date": "25-Jul-15", "value": 8, "dateUTC" : "2015-07-25T07:00:00.000Z"},
          {"date": "26-Jul-15", "value": 13, "dateUTC" : "2015-07-26T07:00:00.000Z"},
          {"date": "27-Jul-15", "value": 18, "dateUTC" : "2015-07-27T07:00:00.000Z"},
          {"date": "28-Jul-15", "value": 14, "dateUTC" : "2015-07-28T07:00:00.000Z"},
          {"date": "29-Jul-15", "value": 30, "dateUTC" : "2015-07-29T07:00:00.000Z"},
          {"date": "30-Jul-15", "value": 33, "dateUTC" : "2015-07-30T07:00:00.000Z"},
          {"date": "31-Jul-15", "value": 0, "dateUTC" : "2015-07-31T07:00:00.000Z"},
          {"date": "1-Aug-15", "value": 0, "dateUTC" : "2015-08-01T07:00:00.000Z"},
          {"date": "2-Aug-15", "value": 0, "dateUTC" : "2015-08-02T07:00:00.000Z"}
        ]
      }
    ],
    "dataByDate": [
      {
        "date": "2015-06-27T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 1, "topicName": "San Francisco"},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 149, "value": 0, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 3, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-06-28T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 1, "topicName": "San Francisco"},
          {"name": 149, "value": 2, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 9, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-06-29T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 18, "topicName": "Los Angeles"},
          {"name": 81, "value": 1, "topicName": "Oakland"},
          {"name": 103, "value": 4, "topicName": "San Francisco"},
          {"name": 149, "value": 4, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 6, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-06-30T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 1, "topicName": "Los Angeles"},
          {"name": 103, "value": 2, "topicName": "San Francisco"},
          {"name": 149, "value": 3, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 11, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-01T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 6, "topicName": "Los Angeles"},
          {"name": 103, "value": 3, "topicName": "San Francisco"},
          {"name": 149, "value": 1, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 7, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-02T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 3, "topicName": "San Francisco"},
          {"name": 149, "value": 3, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 10, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-03T07:00:00.000Z",
        "topics":[
          {"name": 149, "value": 3, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 103, "value": 0, "topicName": "San Francisco"},
          {"name": 0, "value": 5, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-04T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 3, "topicName": "San Francisco"},
          {"name": 149, "value": 1, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 10, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-05T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 1, "topicName": "San Francisco"},
          {"name": 149, "value": 2, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 8, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-06T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 2, "topicName": "San Francisco"},
          {"name": 149, "value": 2, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 10, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-07T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 15, "topicName": "Los Angeles"},
          {"name": 149, "value": 4, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 103, "value": 0, "topicName": "San Francisco"},
          {"name": 0, "value": 6, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-08T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 32, "topicName": "Los Angeles"},
          {"name": 103, "value": 2, "topicName": "San Francisco"},
          {"name": 149, "value": 7, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 14, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-09T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 1, "topicName": "Oakland"},
          {"name": 103, "value": 1, "topicName": "San Francisco"},
          {"name": 149, "value": 1, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 12, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-10T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 4, "topicName": "San Francisco"},
          {"name": 149, "value": 5, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 17, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-11T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 1, "topicName": "Oakland"},
          {"name": 103, "value": 2, "topicName": "San Francisco"},
          {"name": 149, "value": 9, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 9, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-12T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 1, "topicName": "Oakland"},
          {"name": 103, "value": 1, "topicName": "San Francisco"},
          {"name": 149, "value": 5, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 9, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-13T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 3, "topicName": "Los Angeles"},
          {"name": 103, "value": 6, "topicName": "San Francisco"},
          {"name": 149, "value": 2, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 9, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-14T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 2, "topicName": "Oakland"},
          {"name": 103, "value": 5, "topicName": "San Francisco"},
          {"name": 149, "value": 8, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 11, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-15T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 3, "topicName": "Oakland"},
          {"name": 103, "value": 2, "topicName": "San Francisco"},
          {"name": 149, "value": 3, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 16, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-16T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 15, "topicName": "Los Angeles"},
          {"name": 103, "value": 7, "topicName": "San Francisco"},
          {"name": 149, "value": 1, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 6, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-17T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 3, "topicName": "San Francisco"},
          {"name": 149, "value": 2, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 7, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-18T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 1, "topicName": "San Francisco"},
          {"name": 149, "value": 7, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 8, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-19T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 2, "topicName": "Oakland"},
          {"name": 103, "value": 4, "topicName": "San Francisco"},
          {"name": 149, "value": 1, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 4, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-20T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 7, "topicName": "Oakland"},
          {"name": 103, "value": 8, "topicName": "San Francisco"},
          {"name": 149, "value": 5, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 9, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-21T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 4, "topicName": "San Francisco"},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 149, "value": 0, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 5, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-22T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 5, "topicName": "Los Angeles"},
          {"name": 81, "value": 1, "topicName": "Oakland"},
          {"name": 103, "value": 11, "topicName": "San Francisco"},
          {"name": 149, "value": 2, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 7, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-23T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 2, "topicName": "Oakland"},
          {"name": 103, "value": 7, "topicName": "San Francisco"},
          {"name": 149, "value": 5, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 7, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-24T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 1, "topicName": "Los Angeles"},
          {"name": 103, "value": 5, "topicName": "San Francisco"},
          {"name": 149, "value": 2, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 10, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-25T07:00:00.000Z",
        "topics":[
          {"name": 103, "value": 5, "topicName": "San Francisco"},
          {"name": 149, "value": 2, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 8, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-26T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 1, "topicName": "Los Angeles"},
          {"name": 103, "value": 6, "topicName": "San Francisco"},
          {"name": 149, "value": 3, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 0, "value": 13, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-27T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 1, "topicName": "Oakland"},
          {"name": 103, "value": 16, "topicName": "San Francisco"},
          {"name": 149, "value": 8, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 18, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-28T07:00:00.000Z",
        "topics":[
          {"name": 81, "value": 2, "topicName": "Oakland"},
          {"name": 103, "value": 17, "topicName": "San Francisco"},
          {"name": 149, "value": 11, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 0, "value": 14, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-29T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 3, "topicName": "Los Angeles"},
          {"name": 81, "value": 2, "topicName": "Oakland"},
          {"name": 103, "value": 15, "topicName": "San Francisco"},
          {"name": 149, "value": 17, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 30, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-30T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 2, "topicName": "Los Angeles"},
          {"name": 81, "value": 6, "topicName": "Oakland"},
          {"name": 103, "value": 12, "topicName": "San Francisco"},
          {"name": 149, "value": 14, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 33, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-07-31T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 103, "value": 0, "topicName": "San Francisco"},
          {"name": 149, "value": 0, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 0, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-08-01T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 103, "value": 0, "topicName": "San Francisco"},
          {"name": 149, "value": 0, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 0, "topicName": "Other"}
        ]
      },
      {
        "date": "2015-08-02T07:00:00.000Z",
        "topics":[
          {"name": 60, "value": 0, "topicName": "Los Angeles"},
          {"name": 81, "value": 0, "topicName": "Oakland"},
          {"name": 103, "value": 0, "topicName": "San Francisco"},
          {"name": 149, "value": 0, "topicName": "Unknown Location with a super hyper mega very very very long name."},
          {"name": 0, "value": 0, "topicName": "Other"}
        ]
      }
    ]
  };
    var lineMargin = {top:60, bottom: 50, left: 50, right: 30};  
  
  
  /* ========================================================= */
  var chartTooltip = function() {
      return britecharts.tooltip()
        .topicsOrder(lineData.dataByTopic.map(function(topic) {
            return topic.topic;
        }));
  };
  
  function createLineChart() {
  
    var lineContainer = d3.select('#line');
    var container = d3.select('.js-line-chart-container');
    
    
    var containerWidth = container.node() ? container.node().getBoundingClientRect().width : false;
    
    var lineChartInstance = britecharts.line()
          .isAnimated(true)
          .aspectRatio(0.5)
          .grid('horizontal')
          .tooltipThreshold(600)
          .width(containerWidth)
          .margin(lineMargin)
          .dateLabel('dateUTC')
          .on('customMouseOver', chartTooltip.show)
          .on('customMouseMove', chartTooltip.update)
          .on('customMouseOut', chartTooltip.hide)
          .on('customDataEntryClick', function(d, mousePosition) {
            console.log('Data entry marker clicked', d);
          });
    
    var tooltipContainer = d3.select('.js-line-chart-container .metadata-group .hover-marker');
    
    tooltipContainer.datum([]).call(chartTooltip);
    
    d3.select('#button').on('click', function() {
      lineChartInstance.exportChart('linechart.png', 'Britecharts Line Chart');
    });
    lineContainer.datum(lineData).call(lineChartInstance);
    
    return lineChartInstance;
  }
  
  var brushMargin = {top:0, bottom: 40, left: 50, right: 30};
  
  
  function createBrushChart(optionalColorSchema) {
      let brushContainer = d3.select('.js-line-brush-chart-container');
      let containerWidth = brushContainer.node() ? brushContainer.node().getBoundingClientRect().width : false;
      var lineContainer = d3.select('#line');
  
      let brushChart = function() {
        return britecharts.brush().width(containerWidth)
          .height(100)
          .margin(brushMargin)
          .on('customBrushEnd', function(brushExtent) {
              let format = d3.timeFormat('%m/%d/%Y');
          var chartTooltip = function() {
      return britecharts.tooltip()
        .topicsOrder(lineData.dataByTopic.map(function(topic) {
            return topic.topic;
        }));
  };
  
              d3.select('.js-start-date').text(format(brushExtent[0]));
              d3.select('.js-end-date').text(format(brushExtent[1]));
              d3.select('.js-date-range').classed('is-hidden', false);
  
              // Filter
              var brushData = filterData(brushExtent[0], brushExtent[1]);
                  
           var lineChart2 = britecharts.line()
                          .isAnimated(true)
                          .aspectRatio(0.5)
                          .grid('horizontal')
                          .tooltipThreshold(600)
                          .width(containerWidth)
                          .margin(lineMargin)
                          .dateLabel('dateUTC')
                          .on('customMouseOver', chartTooltip.show)
                          .on('customMouseMove', chartTooltip.update)
                          .on('customMouseOut', chartTooltip.hide)
                          .on('customDataEntryClick', function (d, mousePosition) {
                              console.log('Data entry marker clicked', d);
                          });
              d3.select('#line .line-chart').remove();
              lineContainer.datum(brushData).call(lineChart2);
          });
      }
  
      if (containerWidth) {
          var firstBrushChart = brushChart();
          brushContainer.datum(brushDataAdapter(lineData)).call(firstBrushChart);
      }
  }
  
  function brushDataAdapter(dataLine) {
      return dataLine.dataByDate.map(function(d){
          d.value = d.topics.reduce(function(acc, topic) {
              return acc + topic.value;
          },0);
  
          return d;
      })
  }
  
  function filterData(d0, d1) {
      var data = JSON.parse(JSON.stringify(lineData));
  
      data.dataByDate = data.dataByDate.filter(isInRange.bind(null, d0, d1));
  
      data.dataByTopic = data.dataByTopic.map((topic) => {
          topic.dates = topic.dates.filter(isInRange.bind(null, d0, d1));
  
          return topic;
      });
  
      return data;
  }
  
  function isInRange(d0, d1, d) {
      return new Date(d.date) >= d0 && new Date(d.date) <= d1;
  }
  
  createLineChart();
  createBrushChart();
  