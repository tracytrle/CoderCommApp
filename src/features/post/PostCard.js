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
import { deletePost, editPost } from "./postSlice";
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
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function PostCard({ post, userID }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { isLoading } = useSelector((state) => state.post);
  const [open, setOpen] = React.useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  // const handleEdit = () => {
  //   openModal();
  //   handleClose();
  // };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    handleClose();
  };

  const renderMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <Stack spacing={5} sx={{ p: 2, width: 200 }}>
        <Stack direction="row">
          <IconStyle sx={{ mr: 0 }}>
            <DeleteIcon sx={{ justifyContent: "center" }} />
          </IconStyle>
          <Typography variant="btn1">
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={5} sx={{ p: 2, width: 200 }}>
        <Stack direction="row">
          <IconStyle sx={{ mr: 0 }}>
            <EditIcon sx={{ justifyContent: "center" }} />
          </IconStyle>
          <Typography variant="btn1">
            <MenuItem onClick={handleOpenModal}>Edit</MenuItem>
          </Typography>
        </Stack>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <EditForm post={post} />
          </Box>
        </Modal>
      </Stack>
    </Menu>
  );
  return (
    <Card>
      <CardHeader
        disableTypography
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
              sx={{ fontSize: 30 }}
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
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
