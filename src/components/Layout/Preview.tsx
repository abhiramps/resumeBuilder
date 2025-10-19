import { forwardRef } from "react";
import { PreviewContainer } from "../Preview/PreviewContainer";

/**
 * Layout Preview Component Props
 */
interface PreviewProps {
  className?: string;
}

/**
 * Layout Preview Component
 * 
 * This is a wrapper component that integrates the PreviewContainer
 * into the main layout. It provides the preview functionality
 * within the three-panel layout structure.
 */
const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  ({ className = "" }) => {
    return (
      <div className={`layout-preview ${className}`}>
        <PreviewContainer
          showZoomControls={true}
          showPrintMode={true}
          className="h-full"
        />
      </div>
    );
  }
);

Preview.displayName = "Preview";

export default Preview;
