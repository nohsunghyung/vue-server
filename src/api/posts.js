// libs
import { Router } from 'express';
// modules
import PostModel from '../models/PostModel.js';

// router init
const router = Router();

router.post('/', async (req, res) => {
  try {
    const doc = await PostModel.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ data: doc });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ message: '동일한 제목의 글이 존재합니다.', error });
    }
    res.status(400).send({ message: '제목을 입력해주세요.', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const docs = await PostModel.find({
      createdBy: req.user._id,
    })
      .lean()
      .exec();

    res.status(200).json({
      posts: docs,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '제목을 입력해주세요.', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await PostModel.findOne({
      createdBy: req.user._id,
      _id: req.params.id,
    })
      .lean()
      .exec();

    if (!doc) {
      return res.status(400).json({ message: 'The data is not found' });
    }

    res.status(200).json({ ...doc });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '제목을 입력해주세요.', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedDoc = await PostModel.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id,
      },
      req.body,
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedDoc) {
      return res.status(400).json({ message: 'cannot update the data' });
    }

    res.status(200).json({ ...updatedDoc });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '제목을 입력해주세요.', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removed = await PostModel.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id,
    })
      .lean()
      .exec();

    if (!removed) {
      return res.status(400).json({ message: 'cannot remove the data' });
    }

    return res.status(200).json({ ...removed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '알수없는 오류입니다.', error });
  }
});

export default router;
