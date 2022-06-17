const User = require('../models/User')

const router = require('express').Router()

// CRUD

// ユーザー情報の更新
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        // $set でUserSchema内の情報を全て指定する
        $set: req.body,
      })
      res.status(200).json('ユーザー情報が更新されました')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res
      .status(403)
      .json('あなたは自分のアカウントの時だけ情報を更新できます')
  }
})

// ユーザー情報の削除
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json('ユーザー情報が削除されました')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res
      .status(403)
      .json('あなたは自分のアカウントの時だけユーザー情報を更新できます')
  }
})

// ユーザー情報の取得
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, updatedAt, ...other } = user._doc // password updatedAt以外を取得

    res.status(200).json(other)
  } catch (err) {
    return res.status(500).json(err)
  }
})

// ユーザーのフォロー
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id) // フォローしたいユーザーID
      const currentUser = await User.findById(req.body.userId) // 操作をしているユーザーID

      // フォロワーに自分がいなかったらフォローできる
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        })

        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        })

        return res.status(200).json('フォローしました')
      } else {
        return res
          .status(403)
          .json('あなたはすでにこのユーザーをフォローしています')
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(500).json('自分自身をフォローできません')
  }
})

// ユーザーのフォローを外す
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id) // フォローしたいユーザーID
      const currentUser = await User.findById(req.body.userId) // 操作をしているユーザーID

      // フォロワーに存在したらフォローを外せる
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        })

        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        })

        return res.status(200).json('フォローを解除しました')
      } else {
        return res.status(403).json('このユーザーはフォロー解除できません')
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(500).json('自分のアカウントです')
  }
})

module.exports = router
