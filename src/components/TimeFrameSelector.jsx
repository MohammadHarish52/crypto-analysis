import { Button, ButtonGroup, styled, Box } from "@mui/material";

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  "& .MuiButton-root": {
    padding: "8px 16px",
    fontSize: "0.875rem",
    borderColor: theme.palette.grey[800],
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: `${theme.palette.primary.main}15`,
    },
  },
}));

const TimeFrameSelector = ({
  timeFrame,
  onTimeFrameChange,
  marketCapRange,
  onMarketCapChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1,
        width: { xs: "100%", sm: "auto" },
      }}
    >
      <ButtonGroup
        variant="outlined"
        sx={{
          width: { xs: "100%", sm: "auto" },
          "& .MuiButton-root": {
            flex: { xs: 1, sm: "initial" },
            color: "white",
            borderColor: "rgba(255, 255, 255, 0.2)",
            whiteSpace: "nowrap",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
            },
            "&.active": {
              backgroundColor: "primary.main",
            },
          },
        }}
      >
        <Button
          className={timeFrame === "short-term" ? "active" : ""}
          onClick={() => onTimeFrameChange("short-term")}
        >
          Short Term
        </Button>
        <Button
          className={timeFrame === "long-term" ? "active" : ""}
          onClick={() => onTimeFrameChange("long-term")}
        >
          Long Term
        </Button>
      </ButtonGroup>

      <ButtonGroup
        variant="outlined"
        sx={{
          "& .MuiButton-root": {
            color: "white",
            borderColor: "rgba(255, 255, 255, 0.2)",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
            },
            "&.active": {
              backgroundColor: "primary.main",
            },
          },
        }}
      >
        {[100, 200, 300].map((range) => (
          <Button
            key={range}
            className={marketCapRange === range ? "active" : ""}
            onClick={() => onMarketCapChange(range)}
          >
            Top {range}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default TimeFrameSelector;
