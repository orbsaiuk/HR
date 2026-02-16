"use client";

export function HowItWorks({ title = "How It Works", steps }) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
                    {title}
                </h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={step.title} className="text-center">
                            <div className="relative mx-auto mb-4">
                                <div
                                    className={`w-16 h-16 rounded-2xl ${step.color || "bg-blue-50 text-blue-600"} flex items-center justify-center mx-auto`}
                                >
                                    <step.icon size={28} />
                                </div>
                                <span className="absolute -top-2 -right-2 w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {index + 1}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg text-foreground mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
