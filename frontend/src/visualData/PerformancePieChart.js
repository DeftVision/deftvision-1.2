// TODO: pick different metrics to measure
// TODO: redesign UI
// TODO: pick a different type of graph / chart?
// TODO: pick different colors


import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Box, Paper, Stack, Typography} from '@mui/material'

export default function PerformancePieChart({ evaluations }) {
    const upsellData = [
        { name: 'Upsold', value: evaluations.filter(e => e.upsell).length },
        { name: 'Not Upsold', value: evaluations.filter(e => !e.upsell).length },
    ]

    const greetingData = [
        { name: 'Greeting', value: evaluations.filter(e => e.greeting).length },
        { name: 'Not Greeted', value: evaluations.filter(e => !e.greeting).length },
    ];

    const COLORS = ['#0088FE', '#FF8042'];

    return (
        <Box sx={{padding: 10}}>
            <Paper elevation={8}  sx={{padding: 5}}>

                <Typography variant='overline' sx={{fontSize: '1rem', textAlign: 'left', marginLeft: 10, marginTop: 5}}>Performance</Typography>
                <Typography variant='overline' sx={{fontSize: '1rem', border: '1.5px dashed red'}}>Upsold</Typography>
                <ResponsiveContainer width='100%' height={100}>
                    <PieChart>
                        <Pie data={upsellData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={90} fill='#8884d8' label>
                            {upsellData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>


                <Typography variant='overline' sx={{fontSize: '1rem'}}>Greeting</Typography>
                <ResponsiveContainer width='50%' height={300}>
                    <PieChart>
                        <Pie data={greetingData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={90} fill='#82ca9d' label>
                            {greetingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    )
}