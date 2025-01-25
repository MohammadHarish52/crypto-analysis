import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";

const Filters = ({ filters, onFilterChange, anchorEl, onClose }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#1E1E1E",
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
        Filter
      </Typography>
      <FormGroup>
        {filters.map((filter) => (
          <MenuItem key={filter.name} disableGutters>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filter.checked}
                  onChange={() => onFilterChange(filter.name)}
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    "&.Mui-checked": {
                      color: "#059669",
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: "white" }}>{filter.label}</Typography>
              }
            />
          </MenuItem>
        ))}
      </FormGroup>
    </Menu>
  );
};

export default Filters;
