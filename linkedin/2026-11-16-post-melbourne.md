# LinkedIn post draft for 2026-11-16: Melbourne walking and cycling crash map

Draft only. Nothing has been posted. Every fact is from your case study page https://yarida-cv.vercel.app/melbourne-crash.html.

## Post (rewritten 15 Nov, use this one)

This project was not part of any course. I built it on my own and taught myself the method, using real Victorian road crash records.

The question I asked: where in metro Melbourne are people walking and cycling most at risk, when does it happen, and what makes a crash more serious?

I cleaned 14 years of records (2012 to 2025), ran a Getis-Ord Gi* hot-spot test on 1 km hexagons, and made the maps in R and QGIS.

What came out:
- 49% of pedestrian and cyclist crashes in 2021 to 2025 fall in hot spots that cover just 6% of the area.
- The share of pedestrian crashes that end in death or serious injury rises from 41% in 40 km/h zones to 65% in 80+ km/h zones.
- Cyclist crashes peak at 8 am on weekdays. Pedestrian crashes peak at 3 pm.

Two limits: this shows an association, not a cause, and the data has no count of how many people walk or ride in each area, so the hot spots partly show where people travel most.

[add: one sentence in your own words, for example what was hardest or what you want to learn next]

Maps, method and code: https://yarida-cv.vercel.app/melbourne-crash.html

#GIS #RStats #DataAnalytics #RoadSafety #Melbourne

## Post (first draft, kept for comparison)

I built this project on my own, outside my coursework. I taught myself the method and used real Victorian crash records.

The question: where and when are people walking and cycling most at risk in metro Melbourne, and what makes a crash more serious?

What I did: cleaned 14 years of crash records (2012 to 2025), ran a Getis-Ord Gi* hot-spot test on 1 km hexagons, and made the maps in R and QGIS.

What I found:
- 49% of the pedestrian and cyclist crashes in 2021 to 2025 fall in hot spots that cover 6% of the area.
- A pedestrian's chance of being killed or seriously injured rises from 41% in 40 km/h zones to 65% in 80+ km/h zones.
- Cyclist crashes peak at 8 am on weekdays. Pedestrian crashes peak at 3 pm.

This shows an association, not a cause, and the data has no count of how many people walk or ride in each area, so hot spots partly reflect where people travel most.

[add: one sentence on what was hardest, or what you want to learn next]

Maps, method and code: https://yarida-cv.vercel.app/melbourne-crash.html

#GIS #RStats #DataAnalytics #RoadSafety #Melbourne

## Post (shorter version, about 85 words)

I built this on my own, outside my coursework: a map of where people walking and cycling are most at risk in Melbourne.

Using 14 years of real Victorian crash records, a hot-spot test (Getis-Ord Gi*) found that 49% of pedestrian and cyclist crashes in 2021 to 2025 fall in hot spots covering 6% of the area. A pedestrian's chance of being killed or seriously injured rises from 41% in 40 km/h zones to 65% in 80+ km/h zones.

Maps and code: https://yarida-cv.vercel.app/melbourne-crash.html

#GIS #RStats #DataAnalytics

## Pictures to attach (four, in this order)

They are in `linkedin/post-melbourne-images/`. LinkedIn shows the first picture as the cover, so keep the map first.

1. `1-hot-spot-map.jpg`: the hot-spot map of metro Melbourne with the key finding box (49% of crashes in 6% of the area).
2. `2-speed-zones-chart.png`: "The faster the road, the worse the outcome for a pedestrian" (41% to 65%).
3. `3-time-of-day-chart.png`: "Cyclists are hurt in the commute; pedestrians in the afternoon".
4. `4-inner-melbourne-map.jpg`: "Inner Melbourne, street by street" (Elizabeth St and Chapel St are the worst 500 m cells).

Alt text for people who use a screen reader (LinkedIn asks for it under "Add alt text"):
1. Map of metro Melbourne with red hexagon hot spots for pedestrian and cyclist crashes over the CBD, St Kilda and Dandenong.
2. Bar chart: the share of pedestrian crashes with a death or serious injury rises from 41% in 40 km/h zones to 65% in 80+ km/h zones.
3. Heat map of pedestrian and cyclist injury crashes by hour and day of the week.
4. Map of inner Melbourne in 500 m hexagons, with the worst cells on Elizabeth Street and Chapel Street.

You can use fewer pictures. The cover design `linkedin/covers/cover-melbourne.png` is also available.

## Check before posting

- Replace the `[add: ...]` line with your own sentence, or delete it. Search the text for `[` before you post.
- "I taught myself the method": keep it only if that is true for the hot-spot test and the maps. If you taught yourself only part, change the sentence to say which part.
- The page dates the project October 2026. The post does not say "this week", so it stays true on any day.
- Numbers checked against the page: 14 years, 49% in 6%, 41% to 65%, 8 am and 3 pm.
