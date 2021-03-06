const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const StudentModel = require("../models/student");
const classModel = require("../models/kelas");
class StudentController {
  // Dilakukan Oleh Headmaster
  static async createNewStudent(req, res, next) {
    // Random Password Handler
    const randomPassword = () => {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 5; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };

    const {
      first_name,
      last_name,
      gender,
      father_name,
      mother_name,
      date_of_birth,
      father_occupation,
      blood_group,
      religion,
      email,
      addmission_date,
      kelas,
      address,
      phone,
      short_bio,
      role,
      year_academic,
    } = req.body;

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    try {
      const user_password = randomPassword();
      console.log(user_password);
      const subjectForStudent = (
        await classModel.findById(kelas).select("subject")
      ).subject;

      const result = await StudentModel.create({
        first_name,
        last_name,
        gender,
        father_name,
        mother_name,
        date_of_birth,
        father_occupation,
        blood_group,
        religion,
        email,
        addmission_date,
        kelas,
        address,
        phone,
        password: bcrypt.hashSync(user_password, 10),
        short_bio,
        image: `${basePath}${fileName}`,
        role,
        year_academic,
      });

      subjectForStudent.forEach(async (element) => {
        await StudentModel.findByIdAndUpdate(result.id, {
          $push: {
            subject: { subject_name: element },
          },
        });
      });

      const newData1 = await StudentModel.findByIdAndUpdate(result.id, {
        $push: {
          subject: { subject_name: subjectForStudent[0] },
        },
      });

      if (!result && !newData1) {
        return res.status(404).send("the student cannot be created");
      }

      const output = `
      <p>Your account has been created by the admin</p>
                  <h3>Account Details</h3>
      <ul>

        <li>Year Academic      : ${year_academic}</li>
        <li>Name               : ${first_name} ${last_name}</li>
        <li>Password           : ${user_password}</li>
        <li>Role               : ${role}</li>
        <li>Gender             : ${gender}</li>
        <li>Father Name        : ${father_name}</li>
        <li>Mother Name        : ${mother_name}</li>
        <li>Date of Birth      : ${date_of_birth}</li>
        <li>Father Occupation  : ${father_occupation}</li>
        <li>Blood Group        : ${blood_group}</li>
        <li>Religion           : ${religion}</li>
        <li>Email              : ${email}</li>
        <li>Addmission Date    : ${addmission_date}</li>
        <li>Class              : ${kelas}</li>
        <li>Address            : ${address}</li>
        <li>Phone              : ${phone}</li>
        <li>Image              : ${basePath}${fileName}</li>
        <li>Short Bio          : ${short_bio}</li>
      </ul>
      
      `;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "luarbiasaandika@gmail.com",
          pass: "IndraMambuju2",
        },
      });

      res.send(newData1);
      transporter.sendMail(
        {
          from: '"Headmaster ????" <luarbiasaandika@gmail.com>',
          to: `${email}`,
          subject: "Your Account Information???",
          text: "Hello world?",
          html: output,
        },
        (err, info) => {
          if (err) {
            console.log(err);
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      );
    } catch (error) {
      next(error);
    }
  }
  // Dilakukan Oleh Siswa itu sendiri
  static async editStudent(req, res, next) {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      gender,
      father_name,
      mother_name,
      date_of_birth,
      father_occupation,
      blood_group,
      religion,
      email,
      address,
      phone,
      short_bio,
      password,
    } = req.body;

    const userExist = await StudentModel.findById(id);
    let newPassword;
    if (password) {
      newPassword = bcrypt.hashSync(password, 10);
    } else {
      newPassword = userExist.password;
    }

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await StudentModel.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        gender,
        father_name,
        mother_name,
        date_of_birth,
        father_occupation,
        blood_group,
        religion,
        email,
        address,
        phone,
        short_bio,
        password: newPassword,
        image: `${basePath}${fileName}`,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("the student data cannot be updated");
    }
    res.send(user);
  }
  // By Headmaster
  static async editStudentByHeadmaster(req, res, next) {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      gender,
      father_name,
      mother_name,
      date_of_birth,
      father_occupation,
      blood_group,
      religion,
      email,
      addmission_date,
      kelas,
      address,
      phone,
      short_bio,
      role,
      status,
    } = req.body;

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await StudentModel.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        gender,
        father_name,
        mother_name,
        date_of_birth,
        father_occupation,
        blood_group,
        religion,
        email,
        addmission_date,
        kelas,
        address,
        phone,
        short_bio,
        role,
        image: `${basePath}${fileName}`,
        status,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("the student data cannot be updated");
    }
    res.send(user);
  }
  static async getAllStudentData(req, res, next) {
    const studentList = await StudentModel.find()
      .populate({
        path: "kelas",
        populate: [
          {
            path: "teacher",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
          {
            path: "subject",
            populate: {
              path: "teacher_id",
              select: [
                "first_name",
                "last_name",
                "email",
                "phone",
                "short_bio",
              ],
            },
          },
        ],
      })
      .populate({
        path: "subject",
        populate: {
          path: "subject_name",
        },
      });
    if (!studentList) {
      return res.status(500).json({ success: false });
    }
    res.send(studentList);
  }
  static async studentCount(req, res, next) {
    const totalStudent = await StudentModel.countDocuments();
    if (!totalStudent) {
      return res.status(500).json({ success: false });
    }
    res.send({ totalStudent });
  }
  static async getStudentByID(req, res, next) {
    const { id } = req.params;
    try {
      const student = await StudentModel.findById(id).populate({
        path: "kelas",
        populate: [
          {
            path: "teacher",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
          {
            path: "subject",
            populate: {
              path: "teacher_id",
              select: [
                "first_name",
                "last_name",
                "email",
                "phone",
                "short_bio",
              ],
            },
          },
        ],
      });
      if (!student) {
        return res.status(500).json({ success: false });
      }
      res.send(student);
    } catch (error) {
      next(error);
    }
  }
  static async getFemaleStudent(req, res, next) {
    try {
      const totalFemaleStudent = await StudentModel.find({ gender: "Female" });
      return res.send({ totalFemaleStudent: totalFemaleStudent.length });
    } catch (error) {
      next(error);
    }
  }
  static async getMaleStudent(req, res, next) {
    try {
      const totalMaleStudent = await StudentModel.find({ gender: "Male" });
      return res.send({ totalMaleStudent: totalMaleStudent.length });
    } catch (error) {
      next(error);
    }
  }

  static async getAllStudentBySubject(req, res, next) {
    const { id } = req.params;
    const idSubject = id;
    const allStudent = await StudentModel.find({
      "subject.subject_name": idSubject,
    });

    res.send(allStudent);
  }
}

module.exports = StudentController;

// StudentModel.findOneAndUpdate(
//   {
//     _id: el.id_student,
//     "subject.subject_name": id,
//   },
