import { useState, useRef, useCallback, type ReactNode } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { primaryColor, textColor } from "../consts/colors";

interface CarouselProps {
  children: ReactNode[];
  /** Optional dot indicator color override */
  activeDotColor?: string;
}

/**
 * CSS scroll-snap carousel with dot indicators and arrow navigation.
 * Swipe-friendly on mobile via native scroll behavior.
 */
export const Carousel = ({
  children,
  activeDotColor = primaryColor,
}: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(idx);
  }, []);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, []);

  if (children.length === 0) return null;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Scroll container */}
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          width: "100%",
        }}
      >
        {children.map((child, i) => (
          <Box
            key={i}
            sx={{
              flex: "0 0 100%",
              scrollSnapAlign: "start",
              px: { xs: 0.5, sm: 1 },
              alignSelf: "stretch",
            }}
          >
            {child}
          </Box>
        ))}
      </Box>

      {/* Dot indicators — only show on mobile */}
      {isMobile && children.length > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mt: 1.5,
            mb: 1,
          }}
        >
          {children.map((_, i) => (
            <Box
              key={i}
              onClick={() => scrollTo(i)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  i === activeIndex ? activeDotColor : `${textColor}30`,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
