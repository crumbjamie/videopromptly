
# VideoPromptly Video Organization Script
# Run this after downloading videos from Kie.ai

DOWNLOAD_DIR="/Users/jamie/Downloads/veo3-videos"
TARGET_DIR="/Users/jamie/Documents/GitHub/videopromptly/public/videos"

echo "🎬 Organizing Kie.ai videos for VideoPromptly..."

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Check if download directory exists
if [ ! -d "$DOWNLOAD_DIR" ]; then
    echo "❌ Download directory not found: $DOWNLOAD_DIR"
    echo "   Please create it and add your downloaded videos"
    exit 1
fi

echo "📁 Moving videos from $DOWNLOAD_DIR to $TARGET_DIR"

# Copy videos with expected filenames
# Gorilla's Social Media Post
if [ -f "$DOWNLOAD_DIR/gorilla-social-media-post.mp4" ]; then
    cp "$DOWNLOAD_DIR/gorilla-social-media-post.mp4" "$TARGET_DIR/"
    echo "✅ Copied: gorilla-social-media-post.mp4"
else
    echo "⚠️  Missing: gorilla-social-media-post.mp4 (Gorilla's Social Media Post)"
fi

# Elevator Corporate Comedy
if [ -f "$DOWNLOAD_DIR/elevator-corporate-comedy.mp4" ]; then
    cp "$DOWNLOAD_DIR/elevator-corporate-comedy.mp4" "$TARGET_DIR/"
    echo "✅ Copied: elevator-corporate-comedy.mp4"
else
    echo "⚠️  Missing: elevator-corporate-comedy.mp4 (Elevator Corporate Comedy)"
fi

# Batman's Dating Dilemma
if [ -f "$DOWNLOAD_DIR/batman-dating-dilemma.mp4" ]; then
    cp "$DOWNLOAD_DIR/batman-dating-dilemma.mp4" "$TARGET_DIR/"
    echo "✅ Copied: batman-dating-dilemma.mp4"
else
    echo "⚠️  Missing: batman-dating-dilemma.mp4 (Batman's Dating Dilemma)"
fi

# Caveman Rock Discovery Series
if [ -f "$DOWNLOAD_DIR/caveman-rock-discovery.mp4" ]; then
    cp "$DOWNLOAD_DIR/caveman-rock-discovery.mp4" "$TARGET_DIR/"
    echo "✅ Copied: caveman-rock-discovery.mp4"
else
    echo "⚠️  Missing: caveman-rock-discovery.mp4 (Caveman Rock Discovery Series)"
fi

# Crystal Kiwi Physics ASMR
if [ -f "$DOWNLOAD_DIR/crystal-kiwi-physics-asmr.mp4" ]; then
    cp "$DOWNLOAD_DIR/crystal-kiwi-physics-asmr.mp4" "$TARGET_DIR/"
    echo "✅ Copied: crystal-kiwi-physics-asmr.mp4"
else
    echo "⚠️  Missing: crystal-kiwi-physics-asmr.mp4 (Crystal Kiwi Physics ASMR)"
fi

# Superhero Physics Demo
if [ -f "$DOWNLOAD_DIR/superhero-physics-demo.mp4" ]; then
    cp "$DOWNLOAD_DIR/superhero-physics-demo.mp4" "$TARGET_DIR/"
    echo "✅ Copied: superhero-physics-demo.mp4"
else
    echo "⚠️  Missing: superhero-physics-demo.mp4 (Superhero Physics Demo)"
fi

# Glass Strawberry Slicing
if [ -f "$DOWNLOAD_DIR/glass-strawberry-slicing.mp4" ]; then
    cp "$DOWNLOAD_DIR/glass-strawberry-slicing.mp4" "$TARGET_DIR/"
    echo "✅ Copied: glass-strawberry-slicing.mp4"
else
    echo "⚠️  Missing: glass-strawberry-slicing.mp4 (Glass Strawberry Slicing)"
fi

# Satisfying Glass Fruit Series
if [ -f "$DOWNLOAD_DIR/satisfying-glass-fruit-series.mp4" ]; then
    cp "$DOWNLOAD_DIR/satisfying-glass-fruit-series.mp4" "$TARGET_DIR/"
    echo "✅ Copied: satisfying-glass-fruit-series.mp4"
else
    echo "⚠️  Missing: satisfying-glass-fruit-series.mp4 (Satisfying Glass Fruit Series)"
fi

# Viking Last Stand
if [ -f "$DOWNLOAD_DIR/viking-last-stand.mp4" ]; then
    cp "$DOWNLOAD_DIR/viking-last-stand.mp4" "$TARGET_DIR/"
    echo "✅ Copied: viking-last-stand.mp4"
else
    echo "⚠️  Missing: viking-last-stand.mp4 (Viking Last Stand)"
fi

# Rain-Slick Car Chase
if [ -f "$DOWNLOAD_DIR/rain-slick-car-chase.mp4" ]; then
    cp "$DOWNLOAD_DIR/rain-slick-car-chase.mp4" "$TARGET_DIR/"
    echo "✅ Copied: rain-slick-car-chase.mp4"
else
    echo "⚠️  Missing: rain-slick-car-chase.mp4 (Rain-Slick Car Chase)"
fi

# Cliff-Edge Destiny
if [ -f "$DOWNLOAD_DIR/cliff-edge-destiny.mp4" ]; then
    cp "$DOWNLOAD_DIR/cliff-edge-destiny.mp4" "$TARGET_DIR/"
    echo "✅ Copied: cliff-edge-destiny.mp4"
else
    echo "⚠️  Missing: cliff-edge-destiny.mp4 (Cliff-Edge Destiny)"
fi

# Weathered Sea Captain
if [ -f "$DOWNLOAD_DIR/weathered-sea-captain.mp4" ]; then
    cp "$DOWNLOAD_DIR/weathered-sea-captain.mp4" "$TARGET_DIR/"
    echo "✅ Copied: weathered-sea-captain.mp4"
else
    echo "⚠️  Missing: weathered-sea-captain.mp4 (Weathered Sea Captain)"
fi

# Yeti Mountain Blogger
if [ -f "$DOWNLOAD_DIR/yeti-mountain-blogger.mp4" ]; then
    cp "$DOWNLOAD_DIR/yeti-mountain-blogger.mp4" "$TARGET_DIR/"
    echo "✅ Copied: yeti-mountain-blogger.mp4"
else
    echo "⚠️  Missing: yeti-mountain-blogger.mp4 (Yeti Mountain Blogger)"
fi

# Biblical Influencer: Jonah
if [ -f "$DOWNLOAD_DIR/biblical-influencer-jonah.mp4" ]; then
    cp "$DOWNLOAD_DIR/biblical-influencer-jonah.mp4" "$TARGET_DIR/"
    echo "✅ Copied: biblical-influencer-jonah.mp4"
else
    echo "⚠️  Missing: biblical-influencer-jonah.mp4 (Biblical Influencer: Jonah)"
fi

echo ""
echo "📊 Organization complete!"
echo "🔍 Checking what videos are now available:"
ls -la "$TARGET_DIR"/*.mp4 2>/dev/null || echo "No .mp4 files found in target directory"
