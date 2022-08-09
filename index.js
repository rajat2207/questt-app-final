const fs = require('fs');
const csv = require('fast-csv');

const db=require('./config/mongoose.js')
const User=require('./models/user.js');

const data = []

fs.createReadStream('./Users_grade_subject_school_profilePic_2022_08_08.csv')
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', row => data.push(row))
  .on('end', () => {
      console.log(data);
      data.map((item)=>{
          if(item['userable_type']=='App\\Models\\Teacher'||item['userable_type']=='App\\Models\\Student'){
            let country_code=item['mobile'].slice(0,2);
          let phone_number=item['mobile'].slice(2);
          let device_token_x=item['device_token'];

          User.findOne({phone : {
              country_code : country_code,
              mobile : phone_number,
              is_verified: true
            }},(err,user)=>{
                if(err){
                    console.log(err);
                    return;
                }
                if(user){
                    if(item['userable_type']=='App\\Models\\Teacher'){
                        User.updateOne({phone : {
                            country_code : country_code,
                            mobile : phone_number,
                            is_verified: true
                          }},{
                            $set :{
                                teachers:{
                                    id : item['id'],
                                    name: item['name'],
                                    email: {
                                        address: item['email'],
                                        is_verified: true
                                    },
                                    csv_user_id: item['id'],
                                    pin : item['pin']
                                }
                            }
                          },function(err,newUser){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("user updated");
                            }
                        })
                    }else{
                        User.updateOne({phone : {
                            country_code : country_code,
                            mobile : phone_number,
                            is_verified: true
                          }},{
                            $push: {
                                students: {
                                    id : item['id'],
                                    name: item['name'],
                                    email: {
                                        address: item['email'],
                                        is_verified: true
                                    },
                                    school: item['school_id'],
                                    csv_user_id: item['id']
                                }
                            }
                          },function(err,newUser){
                              if(err){
                                  console.log(err);
                              }else{
                                  console.log("user updated");
                              }
                          });
                    }                   
                }else{
                    if(item['userable_type']=='App\\Models\\Teacher'){
                        User.create({
                            phone: {
                                country_code: country_code,
                                mobile: phone_number,
                                is_verified: true
                            },
                            device_token: [device_token_x],
                            tnc: item['tnc'],
                            app_version : item['app_version'],
                            created_at : item['created_at'],
                            updated_at : item['updated_at'],
                            deleted_at : item['deleted_at'],
                            students: [],
                            teachers:{
                                id : item['id'],
                                name: item['name'],
                                email: {
                                    address: item['email'],
                                    is_verified: true
                                },
                                csv_user_id: item['id'],
                                pin : item['pin']
                            }
                        },function(err, newUser){
                            if(err){
                                console.log(err);
                                return;
                            }else if(newUser){
                                console.log("new user created");
                            }
                        })
                    }else{
                        User.create({
                            phone: {
                                country_code: country_code,
                                mobile: phone_number,
                                is_verified: true
                            },
                            device_token: [device_token_x],
                            tnc: item['tnc'],
                            app_version : item['app_version'],
                            created_at : item['created_at'],
                            updated_at : item['updated_at'],
                            deleted_at : item['deleted_at'],
                            students: [
                                {
                                    id : item['id'],
                                    name: item['name'],
                                    email: {
                                        address: item['email'],
                                        is_verified: true
                                    },
                                    school: item['school_id'],
                                    csv_user_id: item['id']
                                }
                            ],
                            teachers:{}
                        },function(err, newUser){
                            if(err){
                                console.log(err);
                                return;
                            }else{
                                console.log("new user created");
                            }
                        })
                    }                   
                }
            })
          }
      })
      console.log("All data added");
  });

  
