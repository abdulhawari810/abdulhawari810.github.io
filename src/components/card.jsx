const colorMap = {
  sage: "bg-sage",
  sand: "bg-sand",
  steel: "bg-steel",
};

export default function Card({ title, description, color = "sage" }) {
  return (
    <div className="group cursor-pointer">
      {/* Card Preview */}
      <div
        className={`${colorMap[color]} aspect-[4/3] rounded-lg mb-4 flex items-center justify-center overflow-hidden`}
      >
        <div className="w-16 h-16 rounded-full bg-background/20 group-hover:scale-110 transition-transform duration-300"></div>
      </div>

      {/* Card Info */}
      <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="text-sm text-secondary-text">{description}</p>
    </div>
  );
}
