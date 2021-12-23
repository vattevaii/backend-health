const Record = require("../models/Record");
const User = require("../models/User");
const Person = require("../models/Person");
const CustomErrorHandler = require("../services/CustomErrorHandler");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { majorId } = req.body;
      console.log('hereere', req.body)
      const person = await Person.findOne({ majorId });
      console.log(person);
      if (!person)
        return res
          .status(404)
          .json({ error: "User with ID not found, Register First!!" });

      const record = new Record({
        type: req.body.type,
        majorId: req.body.majorId,
        vaccine: req.body.vaccine,
        location: req.body.location,
        person: person._id,
        expert: req.user._id,
      });

      person.isVaccinated = true;
      console.log(person, 'here')
      await person.save()

      const savedRecord = await record.save();
      return res
        .status(200)
        .json({ savedRecord, message: "Record created successfully" });
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  delete: async (req, res, next) => {
    const record = await Record.findById(req.params.id);

    if (!record) return next(CustomErrorHandler.notFound("Record not found"));
    const user = await User.findOne({ _id: req.body.userId });

    if (user) {
      if (user.isExpert) {
        await record.remove();
        return res.status(200).json({ message: "Record deleted successfully" });
      } else {
        return next(
          CustomErrorHandler.unAuthorized(
            "You are not authorized to delete this record"
          )
        );
      }
    } else {
      return CustomErrorHandler.unAuthorized(
        "You are not authorized to delete this record"
      );
    }
  },

  // Get all the records
  getAllRecords: async (req, res, next) => {
    const records = await Record.find().select("-_v");
    res.status(200).json(records);
  },

  getRecordsByExpert: async (req, res, next) => {
    const expert = await User.findById({ _id: req.params.expertId });

    // console.log(expert);
    if (expert.isExpert || expert.person == req.params.expertId) {
      const records = await Record.find({ expert: expert._id });
      return res.status(200).json(records);
    }

    res
      .status(400)
      .json({ message: "You must be a health professional to view records" });
  },

  getRecordsOfPerson: async (req, res, next) => {
    const records = await Record.find({ person: req.body.person });

    res.status(200).json(records);
  },

  getRecordByMajorId: async (req, res, next) => {
    try {
      const person = await Person.findOne({ majorId: req.params.majorId });
      if (!person) return res.status(404).json({ message: "Record for given ID not found" })

      console.log(person);
      const records = await Record.find({ person: person._id });

      const record = await Promise.all(records.map(async r => {
        const exp = await User.findById(r.expert);
        const per = await Person.findById(exp.person)
        return { r, per }
      }))
      console.log(record[0])
      res.status(200).json({ record, person });
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong" })
    }
  },

  ensureVaccine: async (req, res, next) => {
    const person = await Person.findById(req.params.personId);
    person.isVaccinated = true;

    await person.save();
    res.status(200).json("Vaccinated Successfully");
  },
};
