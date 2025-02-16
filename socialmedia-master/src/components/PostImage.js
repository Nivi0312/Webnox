import { Box } from "@mui/material";

const PostImage = ({ imageUrl }) => {
  return (
    <Box
      component="img"
      src={imageUrl}
      alt="Post Image"
      sx={{
        width: "auto", 
        maxHeight: 300, 
        objectFit: "cover", 
        borderRadius: 2, 
      }}
    />
  );
};

export default PostImage;
