import { Detail } from './doctor-details';

export class Doctor {
  constructor(firstName, lastName, bio) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio;
    this.details = [];
  }

  static getByCondition(condition) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/doctors?query=${condition}&location=or-portland&user_location=45.52%2C-122.67&sort=distance-asc&skip=0&limit=25&user_key=${process.env.exports.apiKey}`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open('GET', url, true);
      request.send();
    });
  }

  static getByName(name) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/doctors?name=${name}&location=or-portland&user_location=45.52%2C-122.67&sort=full-name-asc&skip=0&limit=10&user_key=${process.env.exports.apiKey}`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open('GET', url, true);
      request.send();
    });
  }

  static getDoctorsList(response) {
    const parsedResponse = JSON.parse(response);
    const doctorList = [];
    parsedResponse.data.forEach((record) => {
      console.log("record", record);
      if (record.profile !== undefined) {
        let doctor = new Doctor(record.profile.first_name, record.profile.last_name, record.profile.bio);
        Doctor.addDetails(doctor, record.practices);
        doctorList.push(doctor);
      }
    });
    return doctorList;
  }


    static addDetails(doctor, detailList) {
      detailList.forEach((detail) => {
        let newDetail = new Detail(
          detail.uid,
          detail.name,
          detail.visit_address,
          detail.phones[0].number,
          detail.website,
          detail.accepts_new_patients,
          detail.lat,
          detail.long,
        );
        Detail.checkNewPatients(newDetail);
        doctor.details.push(newDetail);
      });
    }
  }
