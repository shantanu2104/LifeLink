const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({

  patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  appointmentDate:{
    type:Date,
    required:true
  },

  reason:{
    type:String
  },

  status:{
    type:String,
    enum:["pending","accepted","declined","completed"],
    default:"pending"
  },

  // NEW MEDICAL RECORD FIELDS

  prescription:{
    type:String,
    default:""
  },

  history:{
    type:String,
    default:""
  },

  medicines:[
    {
      name:String,
      dosage:String
    }
  ],

  reports:[
    {
      title:String,
      fileUrl:String
    }
  ],

  nextAppointmentDate:{
    type:Date
  }

},{timestamps:true});

module.exports = mongoose.model("Appointment",AppointmentSchema);