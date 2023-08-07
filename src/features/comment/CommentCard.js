import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  Menu,
  Button,
} from "@mui/material";
import Modal from "@mui/material/Modal";

import MenuItem from "@mui/material/MenuItem";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { deleteComment } from "./commentSlice";

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

function CommentCard({ comment, userID }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    dispatch(deleteComment(comment._id));
    handleCloseConfirmModal();
  };
  const handleCancel = () => {
    handleCloseConfirmModal();
  };

  const renderMenu = (
    <>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Stack spacing={2} sx={{ p: 0, width: 200 }}>
          <Stack direction="row">
            <Typography variant="btn1">
              <MenuItem onClick={handleOpenConfirmModal}>Delete</MenuItem>
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} sx={{ p: 0, width: 200 }}>
          <Stack direction="row">
            <Typography variant="btn1">
              <MenuItem>Edit</MenuItem>
            </Typography>
          </Stack>
        </Stack>
      </Menu>
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
    <>
      <Stack direction="row" spacing={2}>
        <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
        <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
          <Stack
            direction="row"
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.author?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {fDate(comment.createdAt)}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {comment.content}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <CommentReaction comment={comment} />
          </Box>
        </Paper>
        <IconButton>
          <MoreHorizIcon
            sx={{ fontSizee: 30 }}
            onClick={handleClick}
            // loading={isLoading}
          />
        </IconButton>
      </Stack>
      {user._id === userID && renderMenu}
    </>
  );
}

export default CommentCard;
