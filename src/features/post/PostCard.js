import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  Button,
} from "@mui/material";
import Modal from "@mui/material/Modal";

import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "./postSlice";
import useAuth from "../../hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import EditForm from "./EditForm";

const IconStyle = styled(Box)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,

  p: 3,
};

const confirmStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  height: 120,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 1,
  boxShadow: 24,
  p: 3,
};

function PostCard({ post, userID }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { isLoading } = useSelector((state) => state.post);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenModal = (e) => {
    setOpen(true);
    handleClose();
  };

  const handleCloseModal = (e) => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    handleCloseConfirmModal();
  };
  const handleCancel = () => {
    handleCloseConfirmModal();
  };

  const handleOpenConfirmModal = (e) => {
    if (user._id === userID) {
      setOpenConfirm(true);
      handleClose();
    }
  };

  const handleCloseConfirmModal = (e) => {
    setOpenConfirm(false);
  };

  const renderMenu = (
    <>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Stack spacing={3} sx={{ p: 0, width: 200 }}>
          <Stack direction="row">
            <IconStyle sx={{ mr: 0 }}>
              <DeleteIcon sx={{ justifyContent: "center" }} />
            </IconStyle>
            <Typography variant="btn1">
              <MenuItem onClick={handleOpenConfirmModal}>Delete</MenuItem>
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={3} sx={{ p: 0, width: 200 }}>
          <Stack direction="row">
            <IconStyle sx={{ mr: 0 }}>
              <EditIcon sx={{ justifyContent: "center" }} />
            </IconStyle>
            <Typography variant="btn1">
              <MenuItem onClick={handleOpenModal}>Edit</MenuItem>
            </Typography>
          </Stack>
        </Stack>
      </Menu>
      <Modal
        open={open}
        BackdropProps={{
          onClick: null, // Disable backdrop click behavior
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ padding: 0 }}
      >
        <Box sx={style}>
          <EditForm post={post} handleCloseModal={handleCloseModal} />
        </Box>
      </Modal>
      <Modal
        open={openConfirm}
        BackdropProps={{
          onClick: null,
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={confirmStyle}>
          <Typography
            sx={{ mb: 2 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Are you sure you want to delete?
          </Typography>
          <Box
            sx={{
              position: "relative",
              mr: 0,
              marginBottom: 0,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              sx={{
                backgroundColor: "primary.main",
                color: "black",
                mr: 1,
                "&:hover": {
                  backgroundColor: "secondary.main",
                },
              }}
              onClick={handleCancel}
            >
              {" "}
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "primary.main",
                color: "black",
                "&:hover": {
                  backgroundColor: "secondary.main",
                },
              }}
              onClick={handleDelete}
            >
              {" "}
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
  return (
    <Card>
      <CardHeader
        disableTypography
        sx={{ padding: 0 }}
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <IconButton>
            <MoreVertIcon
              sx={{ fontSizee: 30 }}
              onClick={handleClick}
              loading={isLoading}
            />
          </IconButton>
        }
      />

      {user._id === userID && renderMenu}
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>
        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} userID={userID} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
