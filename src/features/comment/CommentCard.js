import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  Menu,
} from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { deleteComment } from "./commentSlice";

function CommentCard({ comment, userID }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    console.log("print cmmtID: ", comment._id);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    dispatch(deleteComment(comment._id));
    handleClose();
  };
  const renderMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <Stack spacing={2} sx={{ p: 0, width: 200 }}>
        <Stack direction="row">
          <Typography variant="btn1">
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
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
