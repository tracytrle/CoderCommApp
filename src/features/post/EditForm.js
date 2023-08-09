import React, { useCallback } from "react";
import {
  Box,
  Card,
  alpha,
  Stack,
  Avatar,
  CardHeader,
  Typography,
  Link,
} from "@mui/material";

import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { editPost } from "./postSlice";
import { LoadingButton } from "@mui/lab";
import { Link as RouterLink } from "react-router-dom";

import { fDate } from "../../utils/formatTime";

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

function EditForm({ post, handleCloseModal }) {
  const { isLoading } = useSelector((state) => state.post);

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      content: `${post.content}`,
      image: `${post.image}`,
    },
  });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useDispatch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = (updatedData) => {
    dispatch(editPost(post._id, updatedData));
    handleCloseModal();
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        sx={{ mt: 0, justifyContent: "flex-start", mb: 2 }}
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
      />
      <FormProvider methods={methods}>
        <Stack spacing={2}>
          <FTextField
            name="content"
            multiline
            fullWidth
            rows={4}
            defaultValue={post.content}
            sx={{
              "& fieldset": {
                borderWidth: `1px !important`,
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />

          <FUploadImage
            name="image"
            accept="image/*"
            value={post.image}
            defaultValue={post.image}
            // defaultValue={`${post.image}`}
            maxSize={3145728}
            onDrop={handleDrop}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={isSubmitting || isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default EditForm;
