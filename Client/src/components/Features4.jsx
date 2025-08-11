"use client"
import clsx from "clsx"
import { ScrollObserver } from "./ui/ScrollObserver"
import TextBorderAnimation from "./ui/TextborderAnimation"
import Particles from "./ui/Particles"

export default function Features4() {
  const items = [
      {
        title: "Loudness correction",
        content: "Ensure that your audio maintains consistent relative loudness across one or many recordings.",
        imageUrl: "https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        title: "Speech isolation",
        content: "Isolate and boost voices, using neural networks trained to distinguish speech from external noise.",
        imageUrl: "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        title: "Noise reduction",
        content: "Eliminate all air conditioners, lawn mowers, noisy neighbors, and other background noises from your recording.",
        imageUrl: "https://images.pexels.com/photos/36762/scarlet-honeyeater-bird-red-feathers.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
    ]
  
  return (
    <div className="min-h-screen relative bg-[#ABAAAA] px-8 py-12 md:px-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}

         <div className="absolute  min-h-screen inset-0 z-0">
{/*         <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={300}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={true}
        /> */}

      </div>
        
        <div className="text-center ">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#1C1536]/80 border border-[#1C1536] text-sm font-medium text-white/90 mb-6">
            🎯 Why Choose Us
          </div>
          <h2 className="font-epilogue text-5xl md:text-6xl font-bold text-black mb-6">
            The Audio Quality
            <TextBorderAnimation text="You Deserve" className=" text-6xl text-[#917dfc] drop-shadow-[0_0_15px_rgba(28,21,54,0.8)]"/>
            {/* <span className="block text-[#917dfc] drop-shadow-[0_0_15px_rgba(28,21,54,0.8)]">
              You Deserve
            </span> */}
          </h2>
          <p className="text-xl text-black/70 max-w-2xl mx-auto leading-relaxed">
            Stop settling for mediocre sound. Our AI-powered tools give you 
            <span className="text-[#917dfc] font-semibold drop-shadow-[0_0_10px_rgba(28,21,54,0.9)]"> studio-grade results </span>
            without the studio-grade complexity.
          </p>
        </div>

        <ScrollObserver className="relative grid grid-cols-2 gap-32">
          {(isHidden) => (
            <>
              <ScrollObserver.TriggerGroup className=" py-[10vh] md:py-[50vh]">
                {items.map((item, index) => (
                  <ScrollObserver.Trigger id={`features-${index}`} key={index} className="relative scroll-mt-[50vh]">
                    {(isActive) => (
                      <div
                        className={clsx(
                          isActive ? "text-white" : "text-black/10 hover:text-black/30",
                          "relative -mx-8 -mb-4 rounded-2xl p-8 transition duration-300 hover:bg-white/10",
                        )}>
                        <div className="font-epilogue text-4xl text-gray-900 font-bold">{item.title}</div>
                        <div className="mt-4 text-lg">{item.content}</div>
                        <a href={`#features-${index}`} className="absolute inset-0"></a>
                      </div>
                    )}
                  </ScrollObserver.Trigger>
                ))}
              </ScrollObserver.TriggerGroup>
              <div className="sticky top-0 h-[60vh] md:h-[100vh]">
                <div className={clsx({ "opacity-0 delay-100": !isHidden }, "absolute inset-0 flex items-center")}>
                  <div className="aspect-square w-full rounded-3xl bg-white/10"></div>
                </div>
               <ScrollObserver.ReactorGroup className="flex items-center justify-center">
                  {items.map((item, index) => (
                    <ScrollObserver.Reactor
                      key={index}
                      id={`features-${index}`}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                    {(isActive) => (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className={clsx(
                            "aspect-square w-full rounded-3xl object-cover transition-opacity",
                            isActive ? "opacity-100" : "opacity-0 delay-100"
                          )}
                        />
                      )}
                    </ScrollObserver.Reactor>
                  ))}
                </ScrollObserver.ReactorGroup>
              </div>
            </>
          )}
        </ScrollObserver>
      </div>
    </div>
  )
}